import React, { Component, createRef } from 'react'
import * as XLSX from 'xlsx'
import './App.css'
import Pretty from 'pretty'

interface IProps {
    myRef?: any;
}

interface IState {
    title?: string;
    guide?: any;
    cell?: any;
    htmlPreview?: any;
}

const TEMPLATE_ID = 'ADMIN_VENDOR_MANAGEMENT'
const DEPARTMENT_ID = 'ADMIN_FACILITES_PROCUREMENT'
const KPI_TITLE = 'Admin - Vendor Manangement'

export default class App extends Component<IProps, IState> {
    private myRef;

    constructor(props: IProps) {
        super(props);

        this.state = {
            title: '',
            guide: [],
            cell: [],
            htmlPreview: ''
        }

        this.myRef = React.createRef<any>();
    }

    componentDidMount = () => {

    }

    setTheader = (data: any) => {
        let result = '';
        let firstRow = data.match(/<tr.*?tr>/ms)

        firstRow = firstRow[0].match(/<td.*?>(.*?)<\/td>/gms)

        firstRow.forEach((item: any, index: number) => {
            firstRow[index] = item.replace(/<td\s(colspan\W+\d+\W)>(.*?)<\/td>/gms, '<td$1>$2</td>')
            firstRow[index] = firstRow[index].replace(/<td\s(rowspan\W+\d+\W)>(.*?)<\/td>/gms, '<td$1>$2</td>')
            firstRow[index] = firstRow[index].replace(/<td(.*?)>(.*?)<\/td>/gms, '<th$1>$2</th>')
            firstRow[index] = firstRow[index].replace(/<th(.*?)(\s+)>(.*?)<\/th>/gms, '<th$1>$3</th>')
            result += firstRow[index]
        });

        result = result.replace(/^(.*?)/, '<thead>$1')
        result = result.replace(/(.*?)$/, '$1</thead><tbody>')
        result = data.replace(/<tr.*?tr>/ms, result)

        result = result.replace(/<tbody>(.*?)<\/table>/, '<tbody>$1</tbody></table>')

        return result
    }

    setVariable = (data: any) => {
        let final = data;

        let evaluation = final.match(/{{ .*? }}/gms)
        let comments = final.match(/:comment.*?:/gms)

        if ((evaluation) && evaluation.length > 0) {
            final = final.replace(/\{\{(.*?)\}\}/gms, '{{ eval::$1::::return$1 }}');
            final = final.replace(/score(.[0-9]*)/gms, '[[score$1]]');
        }

        let scores = final.match(/:\[\[score.*?\]\]:/gms)

        if ((scores) && scores.length > 0) {
            scores.forEach((item: any) => {
                final = final.replace(`${item}`, `{{ ${item.replace(/:\[\[(.*?)\]\]:/, '$1')}::form::numeric }}`)
            })
        }

        if ((comments) && comments.length > 0) {
            comments.forEach((item: any) => {
                final = final.replace(`${item}`, `{{ ${item.replace(':', '')}:form::textarea }}`)
            })
        }

        return final
    }

    setBreakline = (data: any) => {
        let result = ''
        result = data.replace(/(.*?)<br.*?\/>/gms, '\n$1<br\/>')

        return result
    }

    trimmer = (data: any) => {
        let final = data;
        final = data.replace(/data-v=".*?"/gms, '')
            .replace(/data-t=".*?"/gms, '')
            .replace(/xml:space=".*?"/gms, '')
            .replace(/id=".*?"/gms, '')
            .replace(/<td><\/td>/gms, '')
            .trim()

        final = final.replace(/.*?<table>/gms, '<table>')
        final = final.replace(/<\/table>.*/gms, '</table>')

        final = this.setTheader(final)
        final = this.setBreakline(final)
        final = this.setVariable(final)

        return Pretty(final);
    }

    DisplayTable = (props: any) => {
        return (
            <>

            </>
        )
    }

    handleChange = (event: any) => {
        const reader: any = new FileReader()
        const file = event.target.files[0]
        const rABS = !!reader.readAsBinaryString
        const vm: any = this;

        reader.readAsArrayBuffer(file)

        reader.onload = (e: any) => {

            const data = new Uint8Array(reader.result)
            const work_book = XLSX.read(data, { type: 'array' })
            const sheet_name = work_book.SheetNames
            const sheet_data = work_book.Sheets[sheet_name[0]]
            const html_data = XLSX.utils.sheet_to_html(sheet_data)
            const final = this.trimmer(html_data);

            vm.setState({ htmlPreview: final })
            vm.myRef.current.innerHTML = final;
            // console.log(final);
        };
    }

    handleInput = (event: any) => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        this.setState({ [name]: value })
    }

    render() {
        return (
            <>
                <div>
                    <input type="text" onChange={this.handleInput} name="title" />
                </div>
                <br />
                <input type="file" accept="xlsx, csv" onChange={this.handleChange} />
                <br />
                <br />
                <pre>
                    {`
<?php

declare(strict_types=1);

use App\\Models\\Lookups\\Department;
use App\\Models\\Lookups\\KeyPerformanceIndicatorTemplate;
use Illuminate\\Database\\Migrations\\Migration;

class ${this.state.title} extends Migration
{
    private const KPI_TEMPLATE = <<<HTML`}
                </pre>
                <pre>
                    {this.state.htmlPreview}
                </pre>
                <pre>
                    {`
HTML;

    public function up()
    {
        KeyPerformanceIndicatorTemplate::create([
            'id' => KeyPerformanceIndicatorTemplate::${TEMPLATE_ID},
            'content' => self::KPI_TEMPLATE,
            'template_name' => ${KPI_TITLE},
            'department_id' => Department::${DEPARTMENT_ID},
        ]);
    }

    public function down()
    {
        KeyPerformanceIndicatorTemplate::findOrFail(KeyPerformanceIndicatorTemplate::${TEMPLATE_ID})
            ->delete();
    }
}
                    `}
                </pre>
                <br />
                <div ref={this.myRef}></div>
            </>
        )
    }
}
