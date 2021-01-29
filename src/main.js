const appInsights = require('applicationinsights');
appInsights.setup('f9684b4f-65aa-4e8d-9f37-9c98886cd66d').start();

const fs = require('fs');
const express = require('express');
const { actions } = require("./actions");

const app = express();

let config = {
  eventBindings: [],
  modules: []
}

let runningMods = []
function loadMods(mods) {
  if (!mods || !mods.length) return;
  mods.forEach(m => {
    try {
      if (!runningMods[m.path]) {
        runningMods[m.path] = require(m.path);
      }

      runningMods[m.path].modLoader(m.config, config, actions);
    }
    catch (e) {
      console.log(e);
    }
  })
}

function loadSettings(cfg) {
  config.eventBindings = cfg.eventBindings !== undefined ? cfg.eventBindings : [];
  config.modules = cfg.modules !== undefined ? cfg.modules : [];

  loadMods(config.modules)
}

let port = app.get('port') || 60009;
let configPath = app.get('config') || "sampleConfig.json";
app.listen(port, '0.0.0.0', function () {
  console.log('Node app is running on port: ', port);
  loadSettings(JSON.parse(fs.readFileSync(configPath)));
});
