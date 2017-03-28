'use strict';

const vm = require('vm');
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const formidable = require('formidable');
const html = require('./html');
const {fsExistsSync} = require('./utils');
const cwd = process.cwd();

class Jrs{
  constructor(options, jrsFile, req, res, chunk) {
    this.timeout = 30e3;
    this.baseDir = cwd;
    this.jrsFile = jrsFile;
    this.socket = res;
    this.context = { // inject context
      'console': console,
      'require': require,
      'setTimeout': setTimeout,
      'clearTimeout': clearTimeout,
      'setInterval': setInterval,
      'clearInterval': clearInterval,
      'Buffer': Buffer
    };
    this.availableProperties = ['echo', 'end', 'sendFile', 'setMime', 'setCookie', 'setHeader',
      '$_GET', '$_POST', '$_COOKIE', '$_HEADER', '$_FILES', '$_TEMP'];
    html.init(options);
    // JRScript timeout
    this.socket.setTimeout(this.timeout, ()=>this.serviceError('JRS timeout!'));
    this.parseRequest(req, (env)=>this.start(env), chunk);
  }

  parseRequest(req, cb, chunk) {
    let head = req.headers;
    let query = querystring.parse(url.parse(req.url).query);
    let form = new formidable.IncomingForm();
    let fields = {}, files = {};
    let reqUrl = req.url
    form
      .on('error', (err)=>html.send400(this.socket, err))
      .on('file', (field, file)=>{
        if (field in files) {
          if (!(files[field] instanceof Array)) {
            files[field] = [files[field]];
          }
          files[field].push(this._getFileInfo(file));
        } else {
          files[field] = this._getFileInfo(file);
        }
      })
      .on('field', (field, value)=>{
        if (field in fields) {
          if (!(fields[field] instanceof Array)) {
            fields[field] = [fields[field]];
          }
          fields[field].push(value);
        } else {
          fields[field] = value;
        }
      })
      .on('end', ()=>cb({head, query, fields, files, reqUrl}));
    form.parse(req);
    if (chunk) form.write(chunk);
    req.resume();
  }

  _getFileInfo(file) {
    let {name, type, path, size, lastModifiedDate} = file;
    return {name, type, path, size, lastModifiedDate};
  }

  start(env) {
    this.createEnv(env);
    this.createRes();
    this.createContext();
    this.createInjectScript();
    if (fsExistsSync(this.jrsFile)) {
      try {
        let code = fs.readFileSync(this.jrsFile).toString();
        let script = vm.createScript(this.injectScript + code);
        script.runInNewContext(this.context);
      } catch (err) {
        this.serviceError(err);
      }
    } else {
      html.send404(this.socket, this.jrsFile);
    }
  }

  createResponseHead(mime, cookies, heads) {
    let head = Object.assign({'Content-Type': mime}, heads);
    if (cookies) head['Set-Cookie'] = cookies;
    return html.tidyHeadTitle(head);
  }

  responseText(res) {
    let head = this.createResponseHead(res.mime, res.cookie, res.header);
    this.socket.sendHead(200, head);
    this.socket.write(res.body);
    this.socket.end();
    this.socket.setTimeout(0);
  }

  responseFile(fileName, res) {
    let file = path.resolve(this.baseDir, fileName);
    if (fs.existsSync(file)) {
      try {
        let mime = res.mime || html.checkMime(fileName);
        let head = this.createResponseHead(mime, res.cookie, res.header);
        this.socket.sendHead(200, head);
        fs.createReadStream(file).pipe(this.socket);
      } catch (err) {
        this.serviceError(err);
      }
    } else {
      html.send404(this.socket, file);
    }
    this.socket.setTimeout(0);
  }

  responseBinary(buffer, res, isEnd) {
    if (!this._hasSentBinaryHead) {
      let mime = 'application/octet-stream';
      let head = this.createResponseHead(mime, res.cookie, res.header);
      this.socket.sendHead(200, head);
      this._hasSentBinaryHead = true;
      this.socket.setTimeout(0);
    }
    if (!isEnd) {
      this.socket.write(buffer);
    } else {
      this.socket.end();
    }
  }

  createEnv(env) {
    this.__env = {
      GET: env.query,
      POST: env.fields,
      COOKIE: querystring.parse(env.head.cookie, '; '),
      HEADER: env.head,
      FILES: env.files,
      REQURL: env.reqUrl
    };
  }

  createRes() {
    this.__res = {
      body: '', cookie: [], header: {},
      end: this.responseText.bind(this),
      write: this.responseBinary.bind(this),
      sendFile: this.responseFile.bind(this)
    };
  }

  createInjectScript(script) {
    this.injectScript = 'const __JRScript__ = require("./jrscript");' +
      'const {' + this.availableProperties.join(',') + '} = new __JRScript__(__env, __res);';
    this.injectScript += (script || '');
    this.injectScript += ';';
  }

  createContext() {
    this.context['__env'] =   this.__env;
    this.context['__res'] =   this.__res;
  }

  serviceError(err) {
    html.send500(this.socket, err);
  }
}

module.exports = Jrs;
