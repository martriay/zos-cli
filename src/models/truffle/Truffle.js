import path from 'path'
import { Logger, FileSystem as fs } from 'zos-lib'

const log = new Logger('Truffle')

const Truffle = {
  config() {
    try {
      const TruffleConfig = require('truffle-config')
      return TruffleConfig.detect({ logger: console })
    } catch (error) {
      throw Error('You have to provide a truffle.js file, please remember to initialize your project running "zos init".')
    }
  },

  compile(config = undefined) {
    config = config || this.config()
    log.info("Compiling contracts")
    const TruffleCompile = require('truffle-workflow-compile')
    TruffleCompile.compile(config, (err, abstractions, paths) => {
      if (err) log.error(err)
    })
  },

  init(root = process.cwd()) {
    this._initContractsDir(root)
    this._initMigrationsDir(root)
    this._initTruffleConfig(root)
  },

  _initContractsDir(root) {
    const contractsDir = `${root}/contracts`
    this._initDir(contractsDir)
  },

  _initMigrationsDir(root) {
    const migrationsDir = `${root}/migrations`
    this._initDir(migrationsDir);
  },

  _initTruffleConfig(root) {
    const truffleFile = `${root}/truffle.js`
    const truffleConfigFile = `${root}/truffle-config.js`
    if (!fs.exists(truffleFile) && !fs.exists(truffleConfigFile)) {
      const blueprint = path.resolve(__dirname, './blueprint.truffle.js')
      fs.copy(blueprint, truffleConfigFile)
    }
  },

  _initDir(dir) {
    if (!fs.exists(dir)) {
      fs.createDir(dir)
      fs.write(`${dir}/.gitkeep`, null)
    }
  },
}

export default Truffle
