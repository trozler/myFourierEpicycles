## myFourierEpicycles - you give me an image I give you its epicycles.

![Fourier][2]![License][3]

![](./promo/promo_raw.gif)

[2]: https://img.shields.io/badge/fourier-epicycles-blue
[3]: https://img.shields.io/badge/license-MIT-orange

This is the code for a website I'm creating https://www.myfourierepicycles.com/. The site has the following functionality:

- Upload an image and find its fourier epicycles.
- Draw in an image and find its fourier epicycles.

Something which makes this project different than other fourier epicycles websites, is that it allows users to upload any image of a variaty of forms (png, jpeg, svg, gif) and then see its epicycles.

### Note on image selction:

For cleanest drawing use **closed path, medium sized svg's**. Currently the jpeg and png options work, but there is some ugly noise created during conversion. I'm working on making this conversion as lossless as possible.

- First find an svg you want to upload.
- Then I highly highly recommend running the svg through an optimzer such as [this one.](https://jakearchibald.github.io/svgomg/). Doing this will make a huge differnce for your drawings.

### How to install

- `git clone https://github.com/trozler/myFourierEpicycles.git`

### Understanding the Fourier Transfrom

For those curious, these resources are good starting points in understanding the fourier transform and the drawing of epicycles.

3Blue1Brown fourier series:
https://www.youtube.com/watch?v=r6sGWTCMz2k

3Blue1Brown fourier transform:
https://www.youtube.com/watch?v=spUNpyF58BY

More great visusals:
http://www.jezzamon.com/fourier/index.html

The Coding Train (create your own epicycles):
https://www.youtube.com/watch?v=MY4luNgGfms
