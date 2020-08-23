## myFourierEpicycles - you give me an image I give you its epicycles.

![p5][1]![fourier][2]![License][3]

[1]: https://img.shields.io/badge/-p5.js-%23ed225d
[2]: https://img.shields.io/badge/-fourier-blue
[3]: https://img.shields.io/badge/license-MIT-orange

![](promo/epicycles.gif)

This is the code for a website I'm creating https://www.myfourierepicycles.com/.

My motivation for this website is to try and fill a gap left by other work (mentioned at the end), and allow users to upload and draw their own fourier epicycles. The current implementation is far from perfect, but I think it's a good start.

The site has the following functionality:

- Upload a .svg image and find its fourier epicycles.
- Draw in an image and find its fourier epicycles.
- A brief explanation of the mathematics connecting fourier series and revolving epicycles.

### Important note on image selction:

For fast and clear drawings upload SVGs that are less than 50kb and can be made single path. It will be evident that your SVG image cannot be made single path from the output, as the fourier transform will be applied to all paths.

The code uses the [svgo library](https://github.com/svg/svgo) to compress and filter SVG files before they are displayed.

I apologies if some of your uploads, that satisfying these criteria, still don't work. Unfortunately at this stage, some SVGs just require some manual tinkering of parameters. I'm working on this.

### How to run locally

```
$ git clone https://github.com/trozler/myFourierEpicycles.git
$ npm install
$ npm run dev
```

Now open `dist/index.html` on a local web server.

### Understanding the Fourier Transform

For those curious, these resources are good starting points in understanding the fourier transform and the drawing of epicycles.

[3Blue1Brown fourier series](https://www.youtube.com/watch?v=r6sGWTCMz2k) : Great, like really great explanation.

[3Blue1Brown fourier transform](https://www.youtube.com/watch?v=spUNpyF58BY) : Just as great.

[An interactive introduction to the fourier transform](http://www.jezzamon.com/fourier/index.html) :
This article really helped me a lot. Gives excellent animations with explanations.

[The Coding Train](https://www.youtube.com/watch?v=MY4luNgGfms) : Gives a nice guide on how you can draw your own epicycles.
