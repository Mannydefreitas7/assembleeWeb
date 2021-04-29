import moment from "moment";
import { Congregation } from "../models/congregation";
import { Part, WeekProgram, WOLWeek } from "../models/wol";
import { FireStoreService } from "./firestore";
import { WOLApi } from "./wol";
import firebase from 'firebase/app'

export class ProgramsService {

    wolApiService = new WOLApi()

    getMondays(date: Date): Date[] {

        let startMonth = moment(date).startOf('month').day('Monday');
        let endMonth = moment(date).endOf('month');
        let mondays: Date[] = [];
        let numberOfWeeks = moment(endMonth).diff(startMonth, 'week');
        for (var i = 1; i <= numberOfWeeks; i++) {
          let next = startMonth.add(1, 'week');
          mondays.push(next.toDate());
        }
        return mondays;
    }

    addMonthProgram(date: Date, congregation: Congregation, fireStore: firebase.firestore.Firestore) : Promise<any>[] {
        const promises: Promise<any>[] = [];
        let mondays = this.getMondays(date);
        let path : string = `congregations/${congregation.id}`;
        try {
            mondays.forEach(async (monday) => {
            let wolWeekPromise: Response = await this.wolApiService
            .getWeekProgram(
                mondays[0].getFullYear(),
                moment(monday).month() + 1,
                monday.getDate(),
                congregation.fireLanguage?.apiURL!
            )
                  
                if (wolWeekPromise.status === 200) {
                    let wolWeek: WOLWeek = await wolWeekPromise.json();
                    if (wolWeek.items.length > 0) {
                        let start = moment(monday).locale('fr');
                        let range = `${moment(start).format("Do MMM")} - ${start.add(6, 'day').format('Do MMM')}`
                        let week: WeekProgram = this.wolApiService.weekSchedule(wolWeek, monday, path, range)
                        let weekPromise = fireStore.collection(`${path}/weeks`).doc(`${week.id}`).set(week);

                        promises.push(weekPromise);

                        let prayers : Part[] = this.wolApiService.addPrayers(monday, path, week.id!)
                        let chairmans : Part[] = this.wolApiService.addChairmans(monday, path, week.id!)

                        prayers.forEach(prayer => {
                            promises.push(
                            fireStore
                                .doc(`${path}/weeks/${week.id}/parts/${prayer.id}`)
                                .set(prayer)
                            );
                        })
                        chairmans.forEach(chairman => {
                            promises.push(
                            fireStore
                                .doc(`${path}/weeks/${week.id}/parts/${chairman.id}`)
                                .set(chairman)
                            );
                        })
                        
                        if (wolWeek.items.length > 2) {  

                            let midWeekPart : Part[] = this.wolApiService.parseMidWeek(wolWeek, monday, path, week.id!)
                            let weekEndPart : Part[] = this.wolApiService.parseWeekEnd(wolWeek, monday, path, week.id!)

                            promises[0].then(_ => {

                                weekEndPart.forEach(part => {
                                    promises.push(
                                    fireStore
                                        .doc(`${path}/weeks/${week.id}/parts/${part.id}`)
                                        .set(part)
                                    );
                                })

                                midWeekPart.forEach(part => {
                                        promises.push(fireStore.doc(`${path}/weeks/${week.id}/parts/${part.id}`).set(part)
                                    );
                                })
                            
                            })
                        } else if (wolWeek.items.length > 1) {     
                            let weekEndPart : Part[] = this.wolApiService.parseWeekEnd(wolWeek, monday, path, week.id!)
                            promises[0].then(_ => {
                                weekEndPart.forEach(part => {
                                    promises.push(fireStore.doc(`${path}/weeks/${week.id}/parts/${part.id}`).set(part));
                                })
                            }) 
                        }
                    }
                }
            });
            return promises
        } catch (error) {console.log(error)}
        return promises
    }
    

    async addProgram(date: Date, congregation: Congregation, fireStore: firebase.firestore.Firestore) {
        const promises: Promise<any>[] = [];
        let path : string = `congregations/${congregation.id}`;
        try {
            let response: Response = await this.wolApiService.getWeekProgram(
                moment(date).year(),
                moment(date).month() + 1,
                date.getDate(),
                congregation.fireLanguage?.apiURL!
            )
            if (response.status === 200) {

                let wolWeek: WOLWeek = await response.json()
                    if (this.wolApiService.parseWolContent(wolWeek, date, path)) {
                        let wolContent = this.wolApiService.parseWolContent(wolWeek, date, path);
                        let partPromise: Promise<any> = fireStore.collection(`${path}/weeks`).doc(`${wolContent[0].id}`).set(wolContent[0]);
                        promises.push(partPromise);

                        wolContent[1].forEach((part) => {
                            promises.push(fireStore.doc(`${path}/weeks/${wolContent[0].id}/parts/${part.id}`).set(part));
                        });
                    }

                }
        } catch (error) {console.log(error)}
    }
    
}