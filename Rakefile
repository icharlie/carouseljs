require 'jasmine'
require 'fileutils'
load 'jasmine/tasks/jasmine.rake'


task :default do
  puts 'Installing dependencies via bower'
  system('bower','install')
  puts 'Prepare lib folder'
  system('mkdir', 'lib')
  puts 'Copy jquery.min.js'
  FileUtils.cp 'components/jquery/dist/jquery.min.js', 'lib/'
  FileUtils.cp 'components/jquery/dist/jquery.min.map', 'lib/'
end
