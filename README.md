StudyLink (Study Group Finder)

To run backend:

Option 1:
`cd backend` -> `npm install` -> add the .env to /backend -> `npm run dev`

Option 2 (Docker):
Make sure docker is installed (`docker --version`)

`docker build -t [username]/studygroup .`
`docker run -p 8240:8240 [username]/studygroup`

To run frontend:

React Native
Ensure environment setup: https://reactnative.dev/docs/set-up-your-environment

In another terminal, run the frontend:

`cd frontend` -> `npx react-native run-android` (or `npx run-ios` if on mac)
