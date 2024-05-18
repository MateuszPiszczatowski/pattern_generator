# PolTailorEx

**(working title)**

## Goal

Create a web app that can dynamically generate simple sewing patterns split for desired paper format (like A4, US Letter etc.).

## How it works

### Disclaimer

It is not commercialy created application and it has not been extensively tested to check if everything sizewise is perfectly correct. Please use on your on responsibility and test it out on small sizes to check if everything works correctly for you. Feel free to inform me about any bugs you may found.

### How to use: 
First, pick the pattern you want to use (currently only a pattern for a circle skirt is available) with the menu accessible with the "change pattern" button. Next, set your desired paper format, and add some margin because most home printers can't print near the edges. There are preset formats available for commonly used paper formats in Europe and US but in the selection menu, there is also a custom option, that will open a form in which you can define your custom sizes and margins. When everything is ready, click the "show for printing" button to hide everything except the pattern. It is possible to exit this view with the ESC key on your keyboard or pushing the adequate button. Button and message box should be invisible in printing view. From the printing view, you can print it immediately, or use "print to pdf" in your printing configuration to save it as a .pdf file for later usage. It is important to set your margins only in the web app settings, in the printing configuration use no margins and 100% size scale for the pattern to be printed/saved with correct sizing. The first page is a box to check out if the sizes are printed correctly. Please print it alone first, and check if the sizes meet the description. The second page is a guide page that shows how the pattern should be arranged. You can print it or only check it out on the webapp, but please take in consideration, that it is scaled to fit on only one page, so it can be unreadable if it is actually printed for a big pattern.

### Options for pattern

Outside of sizes and other attributes appropriate for the pattern (like degrees for a circle skirt) you can pick:
- if repeating elements should be printed each time or should it only be printed on the elements how many times they should be cut out;
- if the symmetric elements should be halved (the halving edge will be marked).

### Options for paper format
Outside of page and margin sizes, it is possible to disable helping elements (borders, corners, numbers). Borders and corners serve the purpose of helping align the pages correctly when sticking them together (a solid line means the edge of the pattern, dashed means that the page connects to another). Numbers are to make it easier to find which page should be connected next. The pages are counted in rows, so until the solid line on the right is met, the next number (so number two if you're on number one) is to the right. If the right edge has a solid border, then the next page is at the beginning of the next row.

## Further plans
Show/print sizes page and guide page as separate options instead of just adding it to the pattern.
Change the UI so it is more intuitive and margins are editable without launching the paper sizes editor.  
Style the web app so it looks more aesthetically.
Refactor the code (things escalated quickly. When I was starting this project, it was a bit smaller idea than it is now. Due to this lots of things could be done better).  
Implement routing so one would be able to bookmark their favourite patterns instead of the main page.  
Add more patterns.

## Credits

Favicon by [Freepik](freepik.com "Freepik")
