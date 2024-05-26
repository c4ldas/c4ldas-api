
/**
 * This is a simple color logger for terminal. The idea is to make it more user friendly.
 * How to use it: 
 * color.log(chosenColor, message);
 * 
 * Example: 
 * color.log("red", "Hello World");
 * color.log("blue", "Hello World");
 * 
 * In case the first parameter is not a valid color defined in the object "colors",  
 * the message will be sent to the console as is.
 * 
 * Author: c4ldas
 * Version: 0.1.0
 * Date: 2024-05-26
 *  
 */

export const color = {
  log: function (...args) {

    // Define colors
    const colors = {
      // General styles
      bold: "\x1b[1m",
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      dim: "\x1b[2m",
      underscore: "\x1b[4m",
      blink: "\x1b[5m",
      reverse: "\x1b[7m",
      hidden: "\x1b[8m",

      // Foreground colors
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",

      // Background colors
      bgBlack: "\x1b[40m",
      bgRed: "\x1b[41m",
      bgGreen: "\x1b[42m",
      bgYellow: "\x1b[43m",
      bgBlue: "\x1b[44m",
      bgMagenta: "\x1b[45m",
      bgCyan: "\x1b[46m",
      bgWhite: "\x1b[47m",
    };

    // Check if the first argument is a color
    const potentialColor = args[0];
    const isValidColor = Object.keys(colors).some((color) => color === potentialColor);

    // In case the color is invalid, send the message back without color
    if (!isValidColor) {
      return (console.log(args.join(" ")));
    }

    // Remove the color from message parts
    args.shift();

    // Send coloured message
    return console.log(colors[potentialColor] + args.join(" ") + colors.reset);
  }
}