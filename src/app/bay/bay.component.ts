export interface ParsedData {
  title: string;
  magnetLink: string;
  date: string;
  size: string;
  description: string;
  seeds: string;
}

import { Component, ElementRef, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { BayPage } from 'src/app/models/bay-page';
import { PirateElement } from 'src/app/models/pirate-element';
import { environment } from 'src/environments/environment';
import * as cheerio from 'cheerio';

@Component({
    selector: 'app-bay',
    templateUrl: './bay.component.html',
    styleUrls: ['./bay.component.scss'],
    standalone: false
})


export class BayComponent implements OnInit {

  private searchUrl = 'https://tpb.party';
  private piListenerUrl = environment.piListenerBayUrl;
  private proxyurl = environment.proxyurl;

  pirateElements: PirateElement[] = [];
  pages: BayPage[] = [];
  subPages: BayPage[] = [];

  public currentPage = 1;


  constructor(@Inject(HttpClient) private http: HttpClient, private elementRef: ElementRef, private router: Router) { }

  ngOnInit(): void {
  }

  searchTorrents(searchInput: HTMLInputElement) {
    var tempSearchUrl = this.searchUrl + '/search/' + searchInput.value;
    this.parseHtml(tempSearchUrl);
  }

  goToPage(pageNumber: number) {
    var page: BayPage = this.pages.find(x => x.pageNumber == pageNumber)!;
    var tempSearchUrl = this.searchUrl + page.endUrl;

   // this.currentPage = page.pageNumber;
    this.parseHtml(tempSearchUrl);
  }

  parseHtml(searchUrl: string) {
    
    // Setup header data for allowing angular to use proxy
    var headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', 'http://localhost:4200/bay');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'POST');
    const requestOptions = {
      headers: new Headers(headers),
    };

    var innerHTML = '';
    this.pirateElements = [];

    fetch(this.proxyurl + searchUrl, requestOptions)
    .then(response => response.text())
    .then(contents => {

    // const $ = cheerio.load(contents);
    // console.log($('table#searchResult tbody tr').html()); // Check the first row

      const parsedRows = this.parseRowData(contents);
      this.parsedRowToNodes(parsedRows);

      // Handle pagination
      this.createPaginationData(contents);
    })
  }

  private parseRowData(html: string): Array<ParsedData> {
    const $ = cheerio.load(html);

    // Array to store the parsed data
    const parsedData: Array<ParsedData> = [];
  
    // Select the rows in the table (adjust selector to match the actual structure of your table)
    $('table#searchResult tbody tr').each((index, row) => {
      const $row = $(row);
  
      // Extract the magnet link
      const magnetLink = $row.find('a[href^="magnet:?"]').attr('href') || '';

      // Extract the title
      const title = $row.find('a[href]:eq(1)').text().trim();
      const description = $row.find('.detDesc').text().trim();
  
      const size = $row.find('td:nth-child(5)').text().trim();
      const date = $row.find('td:nth-child(3)').text().trim();
  
      // Extract the seeds (e.g., from a specific table cell)
      const seeds = $row.find('td:nth-child(6)').text().trim();
  
      // Add the data to the array
      if (magnetLink && title) {
        parsedData.push({ title, magnetLink, date, size, description, seeds });
      }
    });
   // console.log('full data:');
   // console.log(parsedData); // Log to verify the output
    return parsedData;
  }

  sendTorrentToPi(pirateEl: PirateElement, destination: string){
    var destinationUrl = this.piListenerUrl;
    var magnetEncoded = encodeURIComponent(pirateEl.magnet);
    var locationValue = 3;
    
    switch (destination) {
      case 'nr':
        locationValue = 1;
        break;
      case 'c':
        locationValue = 2;
        break;
      case 'da':
        locationValue = 3;
        break;
    }

    destinationUrl = destinationUrl + '/' + locationValue + '/';
    destinationUrl = destinationUrl + magnetEncoded;

     // Setup header data for allowing angular to use proxy
     var headers = new Headers();

     headers.append('Content-Type', 'application/json');
     headers.append('Accept', 'application/json');
     headers.append('Access-Control-Allow-Origin', 'http://localhost:4200/bay');
     headers.append('Access-Control-Allow-Credentials', 'true');
     headers.append('GET', 'POST');
     const requestOptions = {
       headers: new Headers(headers),
     };

     console.log(this.proxyurl + destinationUrl);
     console.log(destination);
     console.log(JSON.stringify(pirateEl));

     fetch(this.proxyurl + destinationUrl, 
 requestOptions ).then(data => {
      var temp = data.text().then(res => {
        console.log(res);
        if (res.includes("qt5ct")) {
          alert("Download Started on Chocolate Pi!");
        }
      });
    })
  }

  parsedRowToNodes(array: Array<ParsedData>) {
    array.forEach(row => {

    // Create pirateElement and add to list
    if (row.title.length > 0) {
      var pirateEntry: PirateElement = new PirateElement();
      pirateEntry.magnet = row.magnetLink;
      pirateEntry.title = row.title;
      pirateEntry.seeds = row.seeds;
      pirateEntry.size = row.size;
      pirateEntry.date = row.date;
  
      this.pirateElements.push(pirateEntry);
    }
    })
  }

  createPaginationData(contents: string) {
    const $ = cheerio.load(contents);

    // Get the td element
    var searchTd = $('table#searchResult tbody').children().eq(-1);

    // Clear previous data
    this.pages = [];
  
    // Loop entries for links and current page
    // Check if `searchTd` exists
    if (searchTd.length > 0) {
      // Loop through each child of the `td` element
      searchTd.contents().children().each((_, element) => {
        const node = $(element);
   
        // Check if the current node is `<b>` (current page)
        if (node.is('b')) {
          this.currentPage = Number(node.text().trim());
        }

        // Check if the current node is `<a>` (link to another page)
        if (node.is('a')) {
          const newPage = new BayPage();
          const urlEnd = node.attr('href'); // Get href attribute

          // Create and add new page to the list
          newPage.pageNumber = Number(node.text().trim());
          newPage.endUrl = urlEnd || ''; // Handle case where href might be null
          this.pages.push(newPage);
        }
      });
    }

    // Remove duplicate pages
    this.pages = this.pages.filter(x => x.pageNumber);
    this.createSubPages();
  }

  createSubPages() {
    this.subPages = [];

    // Get 2 previous pages
    var leftStartIndex = this.currentPage > 2 ? (this.currentPage-1)-2 : 0;
    var leftEndLength = this.currentPage > 2 ? leftStartIndex + 2 : (this.currentPage == 1 ? 0 : 1);

    // Get 2 next pages
    var rightStartIndex = this.currentPage-1;
    var rightEndLength = 2;

    var leftHandPages = this.pages.slice(leftStartIndex, leftEndLength);
    var rightHandPages = this.pages.slice(rightStartIndex, rightStartIndex + 2);
    
    // Add mock element as the active page
    var currentPageModel = new BayPage();
    currentPageModel.pageNumber = this.currentPage;

    this.subPages.push(...leftHandPages);
    this.subPages.push(currentPageModel);
    this.subPages.push(...rightHandPages);
  }
}
