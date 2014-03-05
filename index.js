#!/usr/local/bin/node

var http          = require('http')
var colors        = require('colors')
var config        = require('./services')
var RESULT_FORMAT = ' %s %s (%s)'

config.services.forEach(function(service){
	var options = {
		port          : service.port,
		successStatus : 200,
		agent         : false
	}

	copyIf(service, options, ['path', 'host', 'successStatus'])

	var req = http.request(options, function(res){
		var statusCode = res.statusCode

		if (statusCode == options.successStatus) {
			console.log(RESULT_FORMAT, '\u2713'.green, service.name.white, statusCode)
		} else {
			console.log(RESULT_FORMAT, '\u2717'.red, service.name.white, statusCode)
		}
		res.on('data', function(){}) // do nothing with the data to prevent it from hanging
	})

	req.on('error', function(e){
		console.log(RESULT_FORMAT, '\u2717'.red, service.name.white, e.message)
	})

	req.setTimeout(config.timeout, function(){
		req.abort()
	})
	req.end()
})

function copyIf(from, to, fields) {
	fields.forEach(function(key){
		if (from[key]) {
			to[key] = from[key]
		}
	})
}