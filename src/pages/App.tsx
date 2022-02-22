import React, { Component, createRef } from 'react'
import * as XLSX from 'xlsx';
import './App.css'

interface IProps {
    myRef?: any;
}

interface IState {
    guide?: any;
    cell?: any;
    htmlPreview?: any;
}

export default class App extends Component<IProps, IState> {
    private myRef;

    constructor(props: IProps) {
        super(props);

        this.state = {
            guide: [],
            cell: [],
            htmlPreview: ''
        }

        this.myRef = React.createRef<any>();
    }

    writeExcel = () => {
        // XLSX.writeFile({
        //     SheetNames: ["Sheet1"],
        //     Sheets: {
        //         Sheet1: {
        //             "!ref": "A1:B2",
        //             A1: { t: 's', v: "A1:A2" },
        //             B1: { t: 'n', v: 1 },
        //             B2: { t: 'b', v: true },
        //             "!merges": [
        //                 { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, /* A1:A2 */
        //                 { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } } /* B1:B2 */
        //             ]
        //         }
        //     }
        // }, 'testingers.xlsx');

        // let data = [{
        //     firstName: 'John',
        //     lastName: 'Doe'
        // }, {
        //     firstName: 'Smith',
        //     lastName: 'Peters'
        // }, {
        //     firstName: 'Alice',
        //     lastName: 'Lee'
        // }]
        // const ws = XLSX.utils.json_to_sheet(data)
        // const wb = XLSX.utils.book_new()
        // XLSX.utils.book_append_sheet(wb, ws, 'Responses')
        // XLSX.writeFile(wb, 'sampleData.export.xlsx')
    }

    componentDidMount = () => {
        this.writeExcel();
    }

    trimmer = (sheet: any) => {
        let data: any = [];
        let option: any = [];

        /* Object.keys(sheet).forEach((key: any, index: number) => {
            if ((key) && key !== '!merges' && key !== '!ref') {
                data.push({ [key]: sheet[key] });
            } else {
                option.push({ [key]: sheet[key] });
            }
        })
        */

        // this.setState({ cell: data })
        console.log(sheet)
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

        reader.readAsArrayBuffer(file)

        reader.onload = (e: any) => {

            const data = new Uint8Array(reader.result)
            // const work_book = XLSX.read(data, { type: rABS ? "binary" : "array" });
            const work_book = XLSX.read(data, { type: 'array' })
            const sheet_name = work_book.SheetNames
            const sheet_data: any = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 })



            // this.trimmer(Sheets);
        };

        // if (rABS) reader.readAsBinaryString(file);
        // else reader.readAsArrayBuffer(file);
    }

    render() {
        return (
            <>
                <input type="file" accept="xlsx, csv" onChange={this.handleChange} />
                <br />
                <br />
                <pre ref={this.myRef}></pre>
            </>
        )
    }
}
