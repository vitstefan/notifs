# Notifs
Clean, yet beautiful notifications to any website. HTML, CSS, JS (TS) plug-in.

Made as small HTML snippet with CSS dependency and TypeScript code to display notification. No other dependencies.

Show simple notifications to your users with useful options. Choose from light/dark theme, distinguish content type with text color, select position of notification, pick regime and lifespan.

See it in action [here](https://vitstefan.com/notifs).

Options:

* **Theme**: Dark, Light.
* **ContentType**: Default (white on dark theme, black on light theme), Success, Error, Warning, Info.
* **Position**: WholeScreen, RightSide, BottomSide, BottomRightCorner.
* **Regime**: JustOne, Dominant, SideBySide, Clear.
* **Lifespan**: OneSecond, TwoSeconds, ThreeSeconds, FourSeconds, FiveSeconds, TillClosed.

For options explanations and more see enum values in the [code](./notifs.ts).

## Import to your project

Copy [lib directory](./lib) with .html file as well for simple import. Or copy just this HTML snippet 

```html
<div class="notifs-canvas notifs-canvas-hidden">
    <ol class="notifs-content notifs-content-hidden">
    </ol>
</div>
```

to your HTML tag body with right imports to CSS and JS files that you can get from [lib directory](./lib) as well:

```html
<link rel="stylesheet" href="./lib/notifs.css">
<script type="text/javascript" defer src="./lib/notifs.js"></script>
```

Or you can import [TypeScript code file](./notifs.ts) instead of JavaScript.

## Usage

After importing simply call JS (TS) function from your code.

Default notification: 

```javascript
buildNotification('Your notification text');
```

With options:

```javascript
buildNotification(
  'Notification with option', 
  NTheme.Light, 
  NContentType.Info, 
  NPosition.RightSide, 
  NRegime.SideBySide, 
  NLifespan.ThreeSeconds
);
```

See above or [code](./notifs.ts) for all options or modify them freely.

## Example

Go to [showcase website](https://vitstefan.com/notifs) to see it in action for yourself.
