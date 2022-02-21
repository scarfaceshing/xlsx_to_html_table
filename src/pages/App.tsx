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
        XLSX.writeFile({
            SheetNames: ["Sheet1"],
            Sheets: {
                Sheet1: {
                    "!ref": "A1:B2",
                    A1: { t: 's', v: "A1:A2" },
                    B1: { t: 'n', v: 1 },
                    B2: { t: 'b', v: true },
                    "!merges": [
                        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, /* A1:A2 */
                        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } } /* B1:B2 */
                    ]
                }
            }
        }, 'testingers.xlsx');
    }

    componentDidMount = () => {
        // this.writeExcel();
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

            console.log(work_book);

            if (sheet_data.length > 0) {
                let table_output = '<table class="table">\n'
                let rowSpanCount = 0;
                let is_null = false;

                for (var row = 0; row < sheet_data.length; row++) {

                    if (!is_null) {
                        table_output += `\t<tr rowspan="${rowSpanCount}"}>\n`
                    } else {
                        table_output += '\t<tr>\n'
                    }

                    for (var cell = 0; cell < sheet_data[row].length; cell++) {
                        if (sheet_data[row][cell]) {
                            is_null = false;

                            if (row == 0) {
                                table_output += '\t\t<th>' + sheet_data[row][cell] + '</th>\n'
                            } else {
                                table_output += '\t\t<td>' + sheet_data[row][cell] + '</td>\n'
                            }
                        } else {
                            is_null = true
                            rowSpanCount++
                        }
                    }

                    table_output += '\t</tr>'

                }

                table_output += '</table>'

                this.setState({ htmlPreview: table_output })
                this.myRef.current.innerHTML = table_output
            }

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
