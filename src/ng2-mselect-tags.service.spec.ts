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
import { MockConnection } from '@angular/http/testing';

describe('ng2 mselect service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [MSelectTagsService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });
  it('can instantiate service when inject service',
    inject([MSelectTagsService], (service: MSelectTagsService) => {
      expect(service instanceof MSelectTagsService).toBe(true);
    }));
  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));
  describe('test get sync | async items()', () => {
    let backend: MockBackend;
    let service: MSelectTagsService;
    let response: Response;
    const list = {
      data: [
        {
          name: 'Sony',
          industry: 'Entertainment',
          year: '1946',
          comments: {
            jonni: 'Amazing company, too bad Vaio is gone',
            rich: 'Only PS4 remains!'
          }
        },
        {
          name: 'IBM',
          industry: 'Business',
          year: '1911',
          comments: {
            jill: 'Superb, showed them how is done',
            john: 'Watson to the rescue'
          }
        },
        {
          name: 'Apple',
          industry: 'Technology',
          year: '1976',
          comments: {
            peter: 'Revolutionary!',
            sally: 'I will always be a fan'
          }
        },
        {
          name: 'Chromeye',
          industry: 'Digital',
          year: '2004',
          comments: {
            frank: 'Magnificent. Best sevice',
            tim: 'Streameye is superb'
          }
        }
      ]
    };
    // returned by external API - filtering is done through [keyword] supplied to the API
    const mockResponse = {
      items: [{
        name: 'Chromeye',
        industry: 'Digital',
        year: '2004',
        comments: {
          frank: 'Magnificent. Best sevice',
          tim: 'Streameye is superb'
        }
      }]
    };
    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new MSelectTagsService(http);
      let options = new ResponseOptions({ status: 200, body: { data: mockResponse } });
      response = new Response(options);
    }));
    it('Should return a list of 1 searching the list synchonously', inject([], () => {
      service.getSyncOptions(list.data, 'Chrome', 'name').subscribe(result => {
        expect(result.length).toEqual(1);
      });
    }));
    it('Should return an Observable of 1 async from mocked using nested accessor', inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getAsyncOptions('www.mockeddata.com/?q=[keyword]', 'Magnificent', 'data.items').subscribe(result => {
        expect(result.length).toBeGreaterThan(0);
      });
    }));
  });
});