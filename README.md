# PolTailorEx CS50 edition

## Project name and purpose

This project has been created as a separate thing from CS50 and adapted to be used as final project for that course (The AI duck says it's ok as long as it's solely mine project and it's not a homework for another course)
The name is PolTailorEx
The purpose is to create a web app that will allow to autogenerate sewing patterns for printing.
It is designed to take more than one pattern, though right now only a pattern for a circle skirt is implemented.
The pattern is split for the paper format and gets additional helping elements:

- 1st page for testing if the sizes are printed correctly,
- 2nd page for guidance how the pattern should be arranged,
- borders and corners that will it easier to properly align the pages.
  The project is run by installing all dependencies with npm and then running the command npm run dev.

## Project status

As for the project status, I can think of many things that I may introduce later, but I believe it's advanced enough as it is to be used as a final project for cs50 course. That's why I've created this branch with this CS50 oriented readme that you're reading right now.
Original repository is avalible under this link: [github.com/MateuszPiszczatowski/pattern_generator](https://github.com/MateuszPiszczatowski/pattern_generator "main branch")
The original project may have been progressed further at the moment of checking this. The branch that is CS50 submission is this one, [cs50_final_project](https://github.com/MateuszPiszczatowski/pattern_generator/tree/cs50_final_project "CS50 branch"). Current progress can be checked on the main branch.

## Used technologies

The project is written in Typescript and with React framework/library (there is come controversy which one React is and I'm not really taking a stance in that discussion right now ;) )
The project uses SVG for pattern generation and Canvas for splitting functionality.
React project has been generated with vite (something like create-react-app but works faster)
For styling I'm using SCSS which is a CSS extension.

## Credits

I've used favicon provided by [Freepik](https://freepik.com "Freepik")

## Files description

./Public/  
&nbsp;&nbsp;&nbsp;&nbsp;| favicon.ico - favicon provided by [Freepik](https://freepik.com "Freepik").

./src/  
&nbsp;&nbsp;&nbsp;&nbsp;| Components/ - each folder containes the component file of .tsx extension, and some of them contains the .module.scss file which are styles for that component.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| CanvasPage - component for a single page of the splitted for printing view.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| FormatForm - component with a form that is used to make custom paperConfig (custom sizes and margins).  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| FormatSetter - component that shows current paper format info and lets the user choose between predefined format or open the format form to make custom one.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| GuidePage - component that creates a guiding page. The guiding page shows how the pattern should be aligned.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Modal - modal that is being shown. When it's shown, the backdrop darkens the rest of the page. Content is being delivered externally, so the modal can contain virtually anything.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PatternForm - form that gets the pattern cofigurator and creates adequate inputs. It sets the imageConfig of the app.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PatternOption - component with a button that will show a form for chosen pattern. It's being used in PatternBrowser.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PatternBrowser - lists pattern options.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PatternSetter - containes patternbrowser and shows the pattern form it the pattern has been chosen.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PrintSplitter - component that showes the pattern splitted for printing, as well as helper pages.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| SizesHelper - component with a square that can be used to check if the sizes are printed correctly. It's shown by printsplitter.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| UnitSelect - select with predefined units, it lets the user to chose the unit. It's used in pattern and format forms.  
&nbsp;&nbsp;&nbsp;&nbsp;| SewingPatterns/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| CircleSkirt.ts - class for Circle Skirt pattern. It's purpose is to generate the SVG element with the pattern as a whole.  
&nbsp;&nbsp;&nbsp;&nbsp;| SewingPatternsConfigurators/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| BaseConfigurator.ts - base, abstract class for configurators, containing shared logic.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| CircleSkirtConfigurator - pattern configurator for CircleSkirt pattern. It contains information about neccesary variables that have to be delivered as well as logic using these to generate a pattern object. I've found it better than containing all these info in the pattern class in terms of readability and understanding what is going on. Also it was easier to implement autogenerated forms.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| patternsConfiguratorsList - in these file I keep a list of existing configurators that is being used to generate buttons in pattern setter.  
&nbsp;&nbsp;&nbsp;&nbsp;| utils/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| geometry.ts - contains toRadians function so that I don't have to remember and manually enter the conversion each time.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| interfaces-n-types.ts - as the name says, it stores interfaces and types used throughout the program.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| paperUtils.ts - PaperConfig class and additional tools for it.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| variables.scss - variables used in scss modules for components, thanks to this I can change them in one place.  
&nbsp;&nbsp;&nbsp;&nbsp;| App.module.scss - styles for App.tsx entry component.  
&nbsp;&nbsp;&nbsp;&nbsp;| App.tsx - function component that is a entry for the whole application. It is a top level thing that I am personally editing.  
&nbsp;&nbsp;&nbsp;&nbsp;| index.css - global styles.  
&nbsp;&nbsp;&nbsp;&nbsp;| main.tsx - main file that has been generated by vite and is rendering the App in the root div.  
&nbsp;&nbsp;&nbsp;&nbsp;| vite-env.d.ts - file generated by vite that I'm not utilizing.

./  
&nbsp;&nbsp;&nbsp;&nbsp;| .eslintrc.cjs - file generated by vite, I haven't touched this.  
&nbsp;&nbsp;&nbsp;&nbsp;| .gitignore - the file that describes what should be ignored when commiting changes with git. It has been generated by vite and I don't think that I've done any changes to it.  
&nbsp;&nbsp;&nbsp;&nbsp;| index.html - root html file. It has head with favicon, title and and meta tags and body with root div and script.  
&nbsp;&nbsp;&nbsp;&nbsp;| package-lock.json - file generated by vite and used by npm for managing packages.  
&nbsp;&nbsp;&nbsp;&nbsp;| package.json - file generated by vite and used by npm for managing packages.  
&nbsp;&nbsp;&nbsp;&nbsp;| README.md - you're reading it right now! ;)  
&nbsp;&nbsp;&nbsp;&nbsp;| tsconfig.json - file generated by vite, containing typescript configuration for the app.  
&nbsp;&nbsp;&nbsp;&nbsp;| tsconfig.node.json - file generated by vite, containing typescript configuration for node running vite.  
&nbsp;&nbsp;&nbsp;&nbsp;| vite.config.ts - vite configuration generated by vite.
