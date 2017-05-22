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
