/**
 * Use:
 * * color.log(chosenColor, message);
 * 
 * Example: 
 * * color.log("red", "Hello World");
 * * color.log("blue", "Hello World");
 * 
 * In case the first parameter isn't a color from `colors` object, `message` will be logged in plain color.
 * 
 * Author: c4ldas *
 * Date: 2024-05-30 *
 */
export const color = {
  /**
   * Logs a message with a specified color or formatting to the console.
   ** color.log("blue", "Hello World");
   * @param {string} chosenColor - The color to use for the message. One of the following:
   * * `black` | `red` | `green` | `yellow` | `blue` | `magenta` | `cyan` | `white` | 
   * `bgBlack` | `bgRed` | `bgGreen` | `bgYellow` | `bgBlue` | `bgMagenta` | `bgCyan` | 
   * `bgWhite` | `bold` | `bright` | `dim` | `underscore` | `blink` | `reverse` | `hidden` | `reset`
   * @param {...string} message - The message to log.
   * * "Hello World"
   */
  log: function (chosenColor, ...message) {
    // Define colors
    const colors = {
      // General formatting
      reset: "\x1b[0m",
      bold: "\x1b[1m",
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
    const isValidColor = Object.keys(colors).some((item) => item === chosenColor);

    // In case the color is invalid, send the message back without color
    if (!isValidColor) {
      return (console.log(message.join(" ")));
    }

    // Send colored message
    return console.log(colors[chosenColor] + message.join(" ") + colors.reset);
  }
}
