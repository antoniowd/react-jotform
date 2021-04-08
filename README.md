# react-jotform

A React component to embed the Jotform iframe [https://www.jotform.com/](https://www.jotform.com/)

This handles the resize mechanism provided by JotForm.

[![npm](https://img.shields.io/npm/v/react-jotform.svg)](https://www.npmjs.com/package/react-jotform)
[![GitHub issues](https://img.shields.io/github/issues/antoniowd/react-jotform.svg)](https://github.com/antoniowd/react-jotform/issues)

## Install
```
npm install react-jotform
```

## Usage
```jsx
import Jotform from 'react-jotform';

<Jotform 
  src="https://form.jotform.com/123456789" 
  defaults={{
    name: 'John'
  }}
/>
```

## Props
- src : The url of your jotform, as given in their publish section. 
- defaults: An object to define defaults values for the jotform.
- scrolling : A boolean to allow or disallow scrolling. Scrolling is turned off by default.
- title: A title for the jotform.
