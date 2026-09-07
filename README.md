# ToDoBuddy

A simple To-Do List web app built with HTML, CSS, JavaScript, and jQuery. It consumes the To-Do List API (`https://todo-list.dcism.org`) for all data — there is no custom back-end.

## Features

- Sign Up
- Sign In
- View To-Do Tasks (Active / Completed)
- Add a Task
- Edit a Task
- Change Task Status (Complete / Restore)
- Delete a Task

## Project Structure

```
todo-web-app/
├── index.html          # Entry point, redirects to signin or dashboard
├── pages/
│   ├── signin.html
│   ├── signup.html
│   └── dashboard.html
├── css/
│   ├── signin.css
│   ├── signup.css
│   └── dashboard.css
└── js/
    ├── api.js           # All API calls (jQuery AJAX)
    ├── auth.js           # Sign in / Sign up form handling
    └── dashboard.js       # Task list rendering, add/edit/status/delete handling
```

## How to Run

Because the app uses relative file paths and loads jQuery from a CDN, open it through a local web server rather than double-clicking the HTML file (some browsers block AJAX requests from `file://` URLs).

**Option 1 — Python**
```
cd todo-web-app
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option 2 — VS Code**
Install the "Live Server" extension, right-click `index.html`, and choose "Open with Live Server."

## How It Works

- `index.html` checks `localStorage` for a saved `user_id`. If found, it redirects to the dashboard; otherwise, to the sign-in page.
- On sign in, the user's `id`, `fname`, `lname`, and `email` are saved to `localStorage` and used across the dashboard.
- The dashboard loads active and completed tasks separately (two calls to `getItems_action.php`, one per status).
- Logging out clears `localStorage` and returns to sign in.

## API Reference

All requests go to `https://todo-list.dcism.org`. See `ToDoAPIDocumentation.pdf` for full request/response details.

| Action | Method | Route |
|---|---|---|
| Sign Up | POST | `/signup_action.php` |
| Sign In | GET | `/signin_action.php` |
| Get Tasks | GET | `/getItems_action.php` |
| Add Task | POST | `/addItem_action.php` |
| Edit Task | PUT | `/editItem_action.php` |
| Change Status | PUT | `/statusItem_action.php` |
| Delete Task | DELETE | `/deleteItem_action.php` |

## Notes

- `editItem_action.php`, `statusItem_action.php`, and `deleteItem_action.php` use `PUT`/`DELETE` to match the API spec. If you ever see CORS errors on these calls in the browser console, the API's CORS setup may only allow GET/POST — in that case, switch the affected call(s) in `js/api.js` back to `POST` as a workaround.
- No sensitive data (passwords, tokens) is stored beyond what's needed for the session; user info lives only in `localStorage` and is cleared on logout.
