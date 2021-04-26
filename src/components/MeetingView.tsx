import React, { useContext } from 'react'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Stack } from '@fluentui/react/lib/Stack';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Part, WeekProgram } from '../models/wol.model';
import { apply, chairmans, life, prayers, treasures } from '../shared/methods';
import { GlobalContext } from '../store/GlobalState';

export default function MeetingView() {
  const { weeks, week, parts, changeWeek } = useContext(GlobalContext)

  return (
    <>
      <Stack>
        <Dropdown
          placeholder="Select an option"
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
        />
        {
          parts && parts.length > 0 ?
            <WeekSchedule /> :
            <Spinner
              className="pt-20"
              size={SpinnerSize.large} />
        }
      </Stack>
    </>
  )
}

const WeekSchedule = () => {

  const { parts } = useContext(GlobalContext)
  return (
    <>
      <Stack>
        <div className="p-4 rounded bg-white shadow-sm my-4">
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
        <div className="p-4 rounded bg-white shadow-sm mt-4">
          <h3 className="mt-0 text-xl font-semibold">Réunion Publique</h3>
          <div className="mt-3 ps-4 flex justify-between items-center">
            <label className="text-gray-400">Président</label>
          </div>
          <h4 className="my-3 fw-bold weekend">DISCOURS PUBLIC</h4>
          <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
            <label className="col-sm-12 col-md-6 col-lg-6 col-form-label"> </label>
          </div>
          <h4 className="my-3 fw-bold weekend">ÉTUDE DE LA TOUR DE GARDE</h4>
          <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
            <label className="col-sm-12 col-md-6 col-lg-6 col-form-label"></label>
          </div>
          <div className="mt-3 ps-4 flex justify-between items-center">
            <label className="col-sm-12 col-md-6 col-lg-6 text-gray-400">Priere</label>
          </div>
        </div>
      </Stack>
    </>
  )
}

interface PartInfoProp {
  part: Part
}

const PartInfo = ({ part }: PartInfoProp) => {
  return (
    <>
      {
        part.assignee ?
          <p className="sm:text-left md:text-right mb-0">
            <span className="mr-2 italic font-bold">{part.assignee?.firstName} {part.assignee?.lastName}</span> <br />
            {
              part.assistant ?
                <span className="mr-2 text-gray-400 font-bold italic">{part.assistant?.firstName} {part.assistant?.lastName}</span> : null
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