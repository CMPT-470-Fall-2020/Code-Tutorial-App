#! /usr/bin/env ruby
require 'socket'
require 'json'
require 'stringio'

server = TCPServer.open(ARGV[0])  

loop {
    client = server.accept       
    loop {    
        $stdout = StringIO.new
        $stderr = StringIO.new
        buffer = client.gets()
        if buffer.nil?
            break
        end
        decoded_json = JSON.parse(buffer)

        begin
        TOPLEVEL_BINDING.eval(decoded_json['code'])
        rescue Exception => e
          $stderr.puts "Backtrace:\n\t#{e.backtrace.join("\n\t")}"
          $stderr.puts "Error during processing: #{$!}"
        end
        out = {"stderr" => $stderr.string, "stdout" => $stdout.string}
        client.puts JSON(out)
    }
}
