# Wedding Website Prototype

This app is a prototype of a wedding website I'm building for my fiancée. The project serves as a day-by-day progress tracker as well as a personal showcase of web development skills.

## How to Run the App

To start the development server, use the following command:

'npm run dev'

## Day 1:

What I did:

- Created a header that has a dynamic countdown for how many days until our wedding day.
- Created the nav bar with links to various pages.
- Created the main page.jsx that renders everything.
- First push.

## Day 2:

What I did:

- Created a Nhost Project that processes the database:
  https://app.nhost.io/orgs/riotfqaddspjmuogrshl/projects/ttkyyarywykcfihkntdm/database/browser/default
- Starting the Process of holding data for the RSVP and maybe going to talk about the Registry later today.
- Got the RSVP table built so that I can register a user and have them add a email and guest. This command removes the data and starts the IDs back to one.:
- Adding the Pie chart and changed some of the styling for the RSVP page.

- I need to add the function where as soon as you rsvp for the wedding that it does a confirmation. Without it, it makes the user think that they didn't register to the event and will confuse the user into submitting their info twice and causing an error.

Run this command in nhost.ios SQL Editor

#### TRUNCATE TABLE plus_ones RESTART IDENTITY CASCADE;

#### TRUNCATE TABLE rsvp RESTART IDENTITY CASCADE;

## Day 3:

What I did:

- Updated the RSVP page so that if you add a plus one it updates the Status Chart so it displays the proper amount of Attending. (only works with one plus one... need to fix it if adding more than one person.)
- Added some usefull U.I to the status chart so that it shows the amount of people per column.
- Added a guest and admin view for the RSVP page with validation.
- Admin RSVP page 60% done? need to fix some of the little bugs and finalize the invite list so I can hard code data and add validation.

## Day 4:

What I did:

- Updated the rsvp page so that if someone has a guest (tested 10 other names as other attendees on one guest) it adds those other attendees as acounted for the remaining and the attending count.
- For Demo Reasons, added a switch to guest view and a logout button for easy back and forth double checking. (will remove once pushed to live.)
- Added a remove/delete function to the database so that in the adminView.jsx I can remove guest if need be.
