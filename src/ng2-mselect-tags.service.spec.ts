import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend,
  Http
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { MSelectTagsService } from './ng2-mselect-tags.service';

describe('ng2 mselect service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ MSelectTagsService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  describe('get sync items()', () => {
    let mockBackend: MockBackend;
    let mSelectService: MSelectTagsService;
    const mockResponse = {
      data: [
        {
          name: 'Sony',
          industry: 'Entertainment',
          year: '1946'
        },
        {
          name: 'IBM',
          industry: 'Business',
          year: '1911'
        },
        {
          name: 'Apple',
          industry: 'Technology',
          year: '1976'
        },
        {
          name: 'Chromeye',
          industry: 'Digital',
          year: '2004'
        }
      ]
    };
    it('can instantiate service when inject service',
      inject([MSelectTagsService], (service: MSelectTagsService) => {
        expect(service instanceof MSelectTagsService).toBe(true);
      }));
    it('can provide the mockBackend as XHRBackend',
      inject([XHRBackend], (backend: MockBackend) => {
        expect(backend).not.toBeNull('backend should be provided');
      }));
    // it('should return an Observable',
    //   inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
    //     mSelectService = new MSelectTagsService(http);
    //     mockBackend = be;


    //     // mockBackend.connections.subscribe((connection) => {
    //     //   connection.mockRespond(new Response(new ResponseOptions({
    //     //     body: JSON.stringify(mockResponse)
    //     //   })));
    //     // });

    //   }));
  });
});