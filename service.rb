require 'rubygems'
require 'sinatra'
require 'json'

require 'net/http'

set :public_folder, '.'

get "/proxy/" do
	url = params[:url]
    return "Access Denied" if !(url.include? ".otcorp.opentable")

	content_type 'application/json'

    uri = URI(url)
    puts url
    return Net::HTTP.get(uri)
end

