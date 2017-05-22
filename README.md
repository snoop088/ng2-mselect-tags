# ng2-mselect-tags
Angular 2+ MultiSelect which adds tags into a container. Click a tag to remove from the selected.

This control will allow you to access any json source or list and use a '.' delimitted accessor (aa.bb.cc) to select which items to list in the control

**Options**
### Inputs that se-multi-select-tags takes
1. minChars - minimum chars before searching starts (0 - default)
2. list - source as an objects array {}[] to traverse
3. searchUrl - source as string of endpoint url in the form of https://api.spotify.com/v1/search?type=artist&limit=25&q=[keyword]. Keyword is used to search the API in the searchUrl field.
4. accessBy - accessor to use for accessing the returned results. E.g. 'items' or 'data.artists'
5. listBy - property used to list the resulted items from the accessor traversal. E.g. 'name', 'id', etc.

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
import { SampleModule } from 'ng2-mselect-tags';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    LibraryModule
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
<sampleComponent></sampleComponent>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Nikolay Dimitrov](mailto:snoop088@gmail.com)
