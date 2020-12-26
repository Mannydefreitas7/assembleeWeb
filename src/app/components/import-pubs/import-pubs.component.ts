import { Component, OnInit } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { LocalStorageService } from 'ngx-webstorage';
import { HourglassModel } from 'src/app/models/hourglass.model';
import { Gender, Privilege, Publisher } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'import-pubs',
  templateUrl: './import-pubs.component.html',
  styleUrls: ['./import-pubs.component.scss']
})
export class ImportPubsComponent implements OnInit {
  csvContent: string;
  fileName: String;
  isEmpty: boolean;
  isOver: boolean;
  congregation: string;
  pdfIsDone: boolean = false;
  public files: NgxFileDropEntry[] = [];
  csvRecords: HourglassModel[] = [];
  header = true;
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private storage: LocalStorageService,
    private fireStoreService: FireStoreService
    ) { }

  ngOnInit(): void {
    this.isEmpty = true
    this.congregation = this.storage.retrieve('congregationref')
  }

  onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
 }

 public fileOver(event) {
    this.isOver = true;
 }

 public fileLeave(event) {
    this.isOver = false;
 }

 setPrivilege(model: HourglassModel) : Privilege {
   switch (model.appt) {
     case 'Elder':
        return Privilege.elder
     case 'MS':
          return Privilege.ms
     default:
       return Privilege.pub
   }
 }


 parseCSV(file: File) {
  this.ngxCsvParser.parse(file, { header: this.header, delimiter: ',' })
  .pipe().subscribe((result: Array<HourglassModel>) => {
      result.forEach(r => {
        let id = this.fireStoreService.fireStore.createId();
        let publisher: Publisher = {
          uid: id,
          email: r.email,
          photoURL: null,
          firstName: r.firstname,
          lastName: r.lastname,
          privilege: this.setPrivilege(r),
          gender: r.sex == 'Male' ? Gender.brother : Gender.sister,
          isInvited: false,
          isWTConductor: false,
          speaker: null,
          parts: []
        }
        this.fireStoreService.fireStore.doc(`${this.congregation}/publishers/${publisher.uid}`).set(publisher)
      })
  }, (error: NgxCSVParserError) => {
    console.log('Error', error);
  });
}


 public dropped(files: NgxFileDropEntry[]) {

  this.files = files;
  for (const droppedFile of files) {

     if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
           this.fileName = file.name;
          // this.parseCSV(file)
          console.log(file)
        });
     } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
     }
  }
}

onFileSelect(input: HTMLInputElement) {

  const files = input.files;
  var content = this.csvContent;
  if (files && files.length) {

     const fileToRead = files[0];

     this.parseCSV(fileToRead)

     const fileReader = new FileReader();
     fileReader.onload = this.onFileLoad;
     fileReader.readAsText(fileToRead, "UTF-8");
  }
}

}
