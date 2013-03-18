require 'rubygems'
require 'sinatra'
require 'json'

set :public_folder, '.'

get "/:start/:stop" do
	d = File.read('AllData.json')
	json = JSON.parse(d)
	start = params[:start].to_i
	stop = params[:stop].to_i
	content_type :json
	return json[start..stop].to_json
end

