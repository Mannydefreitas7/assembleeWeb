import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { LocalStorageService } from 'ngx-webstorage';
import { map, take } from 'rxjs/operators';
import { HourglassModel } from 'src/app/models/hourglass.model';
import { Gender, Privilege, Publisher } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  csvContent: string;
  fileName: string = '';
  isEmpty: boolean;
  isOver: boolean;
  congregation: string;
  pdfIsDone: boolean = false;
  public files: NgxFileDropEntry[] = [];
  csvRecords: HourglassModel[] = [];
  header = true;
  file: File;
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private storage: LocalStorageService,
    private forage: NgForage,
    public modal: NgbActiveModal,
    private fireStoreService: FireStoreService
    ) { }

  ngOnInit(): void {
    this.isEmpty = true
    this.forage.getItem<string>('congregationref').then(item => this.congregation = item)
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
  this.forage.getItem<string>('congregationRef').then(path => {
    let publisherColRef = this.fireStoreService.fireStore.collection<Publisher>(`${path}/publishers`)
    console.log(file)
    this.ngxCsvParser.parse(file, { header: this.header, delimiter: ',' })
    .pipe(take(1)).subscribe((result: Array<HourglassModel>) => {
      console.log(result)
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

          publisherColRef.get().subscribe(pubs => {
              let existing = pubs.docs.filter(p => p.data().lastName.toLowerCase() == r.lastname.toLowerCase() || p.data().firstName.toLowerCase() == r.firstname.toLowerCase())
              if (existing.length == 0) {
                console.log(existing)
                this.fireStoreService.fireStore.doc(`${path}/publishers/${publisher.uid}`).set(publisher)
              }
          })
        })
    }, (error: NgxCSVParserError) => {
      console.log('Error', error);
    }, () => this.modal.close());
  })

}


 public dropped(files: NgxFileDropEntry[]) {

  this.files = files;
  for (const droppedFile of files) {

     if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
           this.fileName = file.name;
           this.file = file;
          // this.parseCSV(file)

        });
     } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
     }
  }
}

import() {
  this.parseCSV(this.file)
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
