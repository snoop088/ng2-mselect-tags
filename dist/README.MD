# ng2-mselect-tags
Angular 2+ MultiSelect which adds tags into a container. Click a tag to remove from the selected. The component is a custom value accessor and supports both template driven and reactive forms. AOT compatible.

This control will allow you to access any json source or list and use a '.' delimitted accessor (aa.bb.cc) to select which items to list in the control

**Options**
### Inputs that ng2-multi-select-tags takes

| Input | Description |
| --- | --- |
| `minChars` | minimum chars before searching starts (0 - default) |
| `list` | source as an objects array {}[] to traverse |
| `searchUrl` | source as string of endpoint url in the form of https://api.spotify.com/v1/search?type=artist&limit=25&q=[keyword]. 'Keyword' is used to search the API in the searchUrl field. |
| `accessBy` | accessor to use for accessing the returned results. E.g. 'items' or 'data.artists' |
| `listBy` | property used to list the resulted items from the accessor traversal. E.g. 'name', 'id', etc |
| `maxPanelHeight` | The max height in pixels that the dropdown with options could become |
| `maxContainerRows` | How many rows of tags to be shown in the collecting container |

### Installation

To install this library, run:

```bash
$ npm install ng2-mselect-tags --save
```

### Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install ng2-mselect-tags
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { MSelectTagsModule } from 'ng2-mselect-tags';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    MSelectTagsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<ng2-mselect-tags></ng2-mselect-tags>
```

### Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

### Disclaimer

This is a simple component with a specific purpose in its early stages of development. I have used this to learn about building and publishing components. It is generated using a Yeoman Generator and utilises rollup to produce AOT compatible FESM. Happy to improve it and receive critique or feature requests :)

### License

MIT © [Nikolay Dimitrov](mailto:snoop088@gmail.com)
