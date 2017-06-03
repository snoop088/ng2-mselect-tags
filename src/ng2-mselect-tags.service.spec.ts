import { MSelectTagsService } from './ng2-mselect-tags.service';
import {
  async, inject, TestBed
} from '@angular/core/testing';


describe('Markdown transformer service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MSelectTagsService
      ]
    });
  });

  it('Should translate markdown to HTML!', async(() => {
      inject([MSelectTagsService], (mselectTagsService: MSelectTagsService) => { 
          expect(mselectTagsService.num).toEqual(1);
      });
    }
  ));
});
// describe('main test', () => {
//     it('always fails', () => {
//         expect(0).toBe(0);
//     });
// });