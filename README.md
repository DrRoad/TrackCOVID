# TrackCOVID

By tracking the spread of the virus, we can flatten the curve.

![logo](doc/logo.png)

- Learn more:
https://trackcovid.net
- Read the peer-reviewed paper in JMIR mHealth and uHealth:
https://doi.org/10.2196/18936
- Read my proposal for public checkpoints:
https://tyleryasaka.me/2020/04/07/public-checkpoints/

![network](doc/interactions.png)

## Web App

A mobile-friendly web app is available for immediate use without any downloads or registration.

https://trackcovid.net/app

## Public Checkpoints

We have created a link which generates a public checkpoint as a printable PDF. Public checkpoints should be generated once per location, per day, and can be posted at public places like stores and workplaces. Public checkpoints can be easily and quickly scanned by anyone with a smartphone as they enter, without entering any information or downloading an application.

https://trackcovid.net/checkpoint

## Admin interface

The admin interface is a feature which would allow authorized users from laboratories and/or health care facilities to issue confirmation codes for diagnoses. The current admin interface is for demonstration purposes only, but it is functional. You can try generating a confirmation code and then use it to confirm your self-report in the app. The [paper](https://doi.org/10.2196/18936) provides more details on the use of confirmation codes.

Login with:
- Username: `user`
- password: `pass`

https://trackcovid.net/admin

## Native Mobile Apps

The web app, above, is the best way to use TrackCOVID at the moment. However, I have developed a prototype for Android and iOS. (Web, Android, and iOS apps are equivalent in functionality.)

Android users may try out the prototype at https://expo.io/@tyleryasaka/trackcovid.

I am currently unable to distribute a prototype for the iPhone, but the application has been tested and works on iOS devices.

See [covidwatch-app](covidwatch-app) for source code and details.

## Server

See [covidwatch-server](covidwatch-server) for source code.

## Network Simulation Model
This is a simplistic model which serves as a proof-of-concept that TrackCOVID's peer-to-peer contact tracing method has potential to impact the outcome of an epidemic, in the right circumstances (including sufficient user adoption). This model was described in the [paper](https://doi.org/10.2196/18936).

Web interface for the simulation: https://tyleryasaka.shinyapps.io/covidwatch/

See [covidwatch-model](covidwatch-model) for source code.

## Contributors

- [Ben Stedman](https://benstedman.com/): logo
- [Tyler Yasaka](https://tyleryasaka.me/): development
- [@equinteros61](https://github.com/equinteros61): translation (Spanish)
- [@sawravchy](https://github.com/sawravchy): translation (Bengali)
- You? (check out our [interest form](https://docs.google.com/forms/d/e/1FAIpQLSfj8AxQ5hVYF2cvlZGv1yopOCLHn71NigqPjyFYSv6sEaQijg/viewform?usp=sf_link))
