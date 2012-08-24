# coding: utf-8

require 'bundler'
Bundler.require(:default, ENV['RACK_ENV'])

require 'rack-flash'
require 'sinatra/redirect_with_flash'

class SinatraApp < Sinatra::Base
    use Rack::Flash
    enable :sessions
    
    helpers Sinatra::RedirectWithFlash
    helpers Sinatra::ContentFor

    register Sinatra::R18n

    configure :production do
      # new relic agent
      require 'newrelic_rpm'
    end
    
    before do
      content_type :html, 'charset' => 'utf-8'
      session[:locale] = params[:locale] if params[:locale]
    end

    not_found do
      erb :not_found, :layout => false
    end

    error do
      erb :error, :layout => false
    end

    get '/' do
      erb :index, :locals => { :selected => 'index' }
    end

    get '/projects' do
      erb :projects, :locals => { :selected => 'projects' }
    end

    get '/contact' do
        erb :contact, :locals => { :selected => 'contact' }
    end
        
    get '/google1839022d23e84ffd.html' do
      "google-site-verification: google1839022d23e84ffd.html"
    end

    post '/contact' do
      if valid_contact_form?(params[:name], params[:from], params[:body]) then
        mail(params[:name], params[:from], params[:body]) 
        flash[:notice] = true
      end

      redirect '/contact'
    end

    private
    
    def valid_contact_form?(name, from, body)
      !name.empty? and !from.empty? and !body.empty?
    end

    def mail(name, from, body)
      if ENV['RACK_ENV'] == 'production' then
        Pony.mail(
           :to => 'falecom@vitoravelino.net', :from => from,
           :subject => "[vitoravelino.net] Contato feito por #{name}", :body => body
        )
      end
    end

end
