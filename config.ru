# coding: utf-8

require 'bundler'
Bundler.require(:default, ENV['RACK_ENV'])
require './app'


if ENV['RACK_ENV'] == 'production' then
  #
  # pony configuration for sendgrid
  #
  Pony.options = {
    :via => :smtp,
    :via_options => {
      :address => 'smtp.searchndgrid.net',
      :port => '587',
      :domain => 'heroku.com',
      :user_name => ENV['SENDGRID_USERNAME'] || "",
      :password => ENV['SENDGRID_PASSWORD'] || "",
      :authentication => :plain,
      :enable_starttls_auto => true
    }
  }

  #
  # redirect www to non-www and some old urls 
  # indexed by search engines to /blog or /
  #
  use Rack::Rewrite do
    # languages
    r301 %r{\/blog\/[\w]{2}\/[-\d\w]+$},    '/blog/'     # /blog/ru/lalala-lelele, /blog/en/lululu-lilili

    # tags
    r301 %r{\/blog\/tag\/[-\w]+$},            '/blog/'    # /blog/tag/free-software
    r301 %r{\/blog\/[\w]{2}\/tag\/[-\w]+$},   '/blog/'    # /blog/it/tag/pasta

    # categories
    r301 %r{\/blog\/category\/[-\w]+$},           '/blog/'    # /blog/category/free-software
    r301 %r{\/blog\/[\w]{2}\/category\/[-\w]+$},  '/blog/'    # /blog/it/category/pasta
    
    # posts
    r301 %r{\/blog\/2009\/06\/13\/wtf\/?$},           '/blog/'
    r301 %r{\/blog\/2009\/06\/13\/fisl-10\/?$},       '/blog/'        
    r301 %r{\/blog\/2009\/12\/11\/cara-nova\/?$},     '/blog/'
    r301 %r{\/blog\/2009\/12\/05\/de-volta-iupi\/?$}, '/blog/'

    # misc
    r301 %r{\/blog\/wp-(.*)}, '/blog/'
    r301 %r{\/contato\/?$}, '/contact'
    r301 %r{\/contrate-me\/?$}, '/contact'
    r301 %r{\/curriculum\/?$}, '/'
    
    r301 %r{.*}, 'http://vitoravelino.net$&', :if => Proc.new { |rack_env|
      rack_env['SERVER_NAME'] != 'vitoravelino.net' and 
      rack_env['SERVER_NAME'] != 'cloudfront.vitoravelino.net'
    }
  end
  
  #
  # new relic agent config
  #
  ENV['APP_ROOT'] ||= File.dirname(__FILE__)
  $:.unshift "#{ENV['APP_ROOT']}/vendor/plugins/newrelic_rpm/lib"
  require 'new_relic/agent/instrumentation/rack'
    
  Toto::Server.class_eval do
    include NewRelic::Agent::Instrumentation::Rack
  end
end

#
# i18n configuration
#
R18n::I18n.default = 'en'


#
# create and configure a toto instance
#
toto = Toto::Server.new do
  Toto::Paths = {
    :templates => "blog/templates",
    :pages => "blog/templates/pages",
    :articles => "blog/articles"
  }

  set :date, lambda {|now| now.strftime("%d %B %Y") }
  set :disqus, "vtoravelino"
  set :summary, :max => 250, :delim => /@#/
  set :prefix, "blog"
  set :author, "Vítor Avelino"
  set :url, "http://vitoravelino.net/blog/"
end

#
# create and configure rack app
#
app = Rack::Builder.new do
  # middlewares
  use Rack::ShowExceptions if ENV['RACK_ENV'] == 'development'
  use Rack::StaticCache, :urls => ['/css', '/js', '/images', '/fonts', '/favicon.ico'], :root => 'public'
  use Rack::CommonLogger
  use Rack::Deflater

  # map requests to /blog to toto
  map '/blog' do
   run toto
  end
  
  # map all the other requests to sinatra
  map '/' do
    run SinatraApp
  end
end.to_app

run app