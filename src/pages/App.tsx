import React, { Component } from 'react'
import * as XLSX from 'xlsx';

interface IProps {
    guide?: any;
    cell?: any;
}

export default class App extends Component {

    constructor(props: IProps) {
        super(props);

        this.state = {
            guide: [],
            cell: []
        }
    }

    trimmer = (sheet: any) => {
        Object.keys(sheet).forEach((key: any, index: number) => {
            let data = [];
        })
    }

    handleChange = (event: any) => {
        const reader: any = new FileReader();
        const file = event.target.files[0];
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e: any) => {
            let file = e.target.result

            const wb = XLSX.read(file, { type: rABS ? "binary" : "array" });
            const SheetNames = wb.SheetNames
            const Sheets = wb.Sheets[SheetNames[0]]
            this.trimmer(Sheets);
        };

        if (rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    }

    render() {
        return (
            <>
                <input type="file" accept="xlsx, csv" onChange={this.handleChange} />
                <br />
                <br />

            </>
        )
    }
}
