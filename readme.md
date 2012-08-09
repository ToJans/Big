# Project #Startup10 - Startup #3 : Project Big

This is one of the projects of a bigger one: [Project #StartUp10: Creating 10 Startups in one year](http://www.corebvba.be/blog/post/Project-Startup10-Learning-to-build-your-own-business.aspx).

The idea of project #3 was to create a platform to implement some really quick solutions for small problems.
I would come to a customer, anayze the small issue in about 2-4 hours; implement it in the same timeframe, and 
by the end of the day the customer should have a working solution.

The solution implementation would have been lowcost, but there would be a small recurring fixed amount/month/user fee.

## Architecture 

It is currently still completely running clientside, and is just  a very simple concept
- you have assets or code with a mime-type
- interaction between code happens using events

The idea was to distribute these events to other clients and the server using signalr or something similar
  
## Example

Here is a simple example to prove the concept

### code://Domain.Alerter - text/x-coffeescript

```coffeescript
class Alerter
                 
  alertcount: 0
  
  alert: (message) ->
    if (@alertcount < 5)
      emit 'alerted'
        message: message
      
  handle 'alerted', (e) ->
    @alertcount+=1
```


### code://Denormalizer.Invoice - text/x-coffeescript

```coffeescript
handle 'alerted', (e) ->
  loader.modifyTable 'table://invoice/123', ->
    @A5 += 1
    @B5 = e.message
  alert (e.message)
```

### code://Example - text/x-coffeescript    

```coffeescript
code://Domain.Alerter
code://Denormalizer.Invoice

SUT = new Alerter()
for i in [1..10]
  SUT.alert "Woohoo %i"

report "<h1>Done</h1>"
```

### How does it work ?

First you need to add the code resources mentioned on top as well as a "Data resource" named "invoice/123"

Then you press "Run" on the example, et voila, everything should work/compile, and you should see the updates 
in the excel-like grid in green, and a "report" saying "Done"

## Demo

As usual, you can find the demo over at Appharbor: [here](http://big.apphb.com/editor/).

## Why are you not persueing with this project/Startup ?

Every single person I mention this to does not "get it", so I consider this not the way to go... For now at least. Maybe 
I will continue with this later on, but for now, I consider this a failure.

# CIAO
