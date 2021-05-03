import React, { useContext, useState } from 'react'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Stack } from '@fluentui/react/lib/Stack';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Part, WeekProgram } from '../models/wol';
import { apply, chairmans, life, prayers, talk, treasures, wt } from '../shared/methods';
import { GlobalContext } from '../store/GlobalState';
import { Link } from 'react-router-dom';
import { SharedColors } from '@fluentui/theme';
import { DefaultButton } from '@fluentui/react';
import { ExportService } from '../services/export';

export default function MeetingView() {
  const { weeks, week, parts, changeWeek } = useContext(GlobalContext)


  return (
    <div className="">
      <Stack>
        {
          week ? <Dropdown
          placeholder="Select a week"
          defaultSelectedKey={week.id}
          className="mt-4"
          onChange={(e, option: any) => changeWeek(option)}
          options={
            weeks && weeks
              .sort((a: WeekProgram, b: WeekProgram) => a.date - b.date)
              .map((week: WeekProgram) => {
                let option: IDropdownOption = {
                  key: week.id ?? "",
                  text: week.range ?? ""
                }
                return option
              })
          }
        /> : null
        }

        {
          parts && parts.length > 0 ?
            <WeekSchedule /> :
            <Spinner
              className="pt-20"
              title="Loading Schedules, please wait..."
              size={SpinnerSize.large} />
        }
      </Stack>
    </div>
  )
}

const WeekSchedule = () => {

  const { parts, week, congregation, firestore } = useContext(GlobalContext)
  const exportService = new ExportService();
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadPDF = () => {
    setIsDownloading(true);
    exportService.downloadPDF([week], congregation, firestore)
    .then(value => setIsDownloading(!value))
}
  return (
    <>
      <Stack>
        <div className="px-10 pb-10 pt-8 rounded bg-white shadow my-4">
          <div className="flex justify-end">
            {
              isDownloading ? <Spinner label="Downloading..." labelPosition="right" /> : 
              <DefaultButton onClick={downloadPDF} text="Download" className="mb-4" iconProps={{ iconName: 'PDF' }} />
            }
          </div>
       
          <h3 className="mt-0 text-xl font-semibold">Réunion de Semaine</h3>
          <div className="mt-3 flex pl-4 flex-wrap justify-between items-center">
            <label className="text-gray-400">Président</label>
            <PartInfo part={chairmans(parts)[0]} />
          </div>
          <div className="mt-3 flex pl-4 flex-wrap justify-between items-center">
            <label className="text-gray-400">Priere</label>
            <PartInfo part={prayers(parts)[0]} />
          </div>
          <h4 className="my-3 font-semibold text-lg treasures">JOYAUX DE LA PAROLE DE DIEU</h4>
          {
            parts && treasures(parts).map(part => {
              return (
                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                  <label>
                    {part.title}
                  </label>
                  <PartInfo part={part} />
                </div>
              )
            })
          }
          
          <h4 className="my-3 font-semibold text-lg apply">APPLIQUE-TOI AU MINISTÈRE</h4>
          {
            parts && apply(parts).map(part => {
              return (
                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                  <label className="w-2/3">
                    {part.title}
                  </label>
                  <PartInfo part={part} />
                </div>
              )
            })
          }
          <h4 className="my-3 font-semibold text-lg life">VIE CHRÉTIENNE</h4>

          {
            parts && life(parts).map(part => {
              return (
                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                  <label className="w-2/3">
                    {part.title}
                  </label>
                  <PartInfo part={part} />
                </div>
              )
            })
          }
          <div className="mt-3 pl-4 flex justify-between items-center">
            <label className="text-gray-400">Priere</label>
            <PartInfo part={prayers(parts)[1]} />
          </div>
        </div>
        <div className="p-10 rounded bg-white shadow mt-4">
          <h3 className="mt-0 text-xl font-semibold">Réunion Publique</h3>
          <div className="mt-3 ps-4 flex justify-between items-center">
            <label className="text-gray-400">Président</label>
            <PartInfo part={chairmans(parts)[1]} />
          </div>
          <h4 className="my-3 fw-bold weekend">DISCOURS PUBLIC</h4>
          <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
            <label className="">{talk(parts)[0].title}</label>
            <PartInfo part={talk(parts)[0]} />
          </div>
          <h4 className="my-3 fw-bold weekend">ÉTUDE DE LA TOUR DE GARDE</h4>
          <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
            <label className="">{wt(parts)[0].title}</label>
            <PartInfo part={wt(parts)[0]} />
          </div>
          <div className="mt-3 ps-4 flex justify-between items-center">
            <label className="col-sm-12 col-md-6 col-lg-6 text-gray-400">Priere</label>
          </div>
        </div>
        <Link 
            style={{ color: SharedColors.green20}}
            className="py-4 text-center"
            to="/login">
            Login
        </Link>
      </Stack>
    </>
  )
}

interface PartInfoProp {
  part: Part
}

export const PartInfo = ({ part }: PartInfoProp) => {
  return (
    <>
      {
        part.assignee ?
          <p className="sm:text-left md:text-right mb-0">
            <span className="mr-2 italic font-bold">{part.assignee?.firstName} {part.assignee?.lastName}</span> <br />
            {
              part.assistant ?
                <span className="mr-2 text-gray-400 font-normal italic">{part.assistant?.firstName} {part.assistant?.lastName}</span> : null
            }
            {
              part.assignee && part.parent === 'talk' && part.assignee.speaker ?
                <span className="mr-2 text-gray-400 fw-bolder fst-italic">{part.assignee.speaker.congregation?.properties?.orgName ?? ""}</span> : null
            }
          </p> : null
      }
    </>
  )
}