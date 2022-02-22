import React, { Component, createRef } from 'react'
import * as XLSX from 'xlsx'
import './App.css'
import Pretty from 'pretty'

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

    componentDidMount = () => {

    }

    trimmer = (data: any) => {
        let final = data;
        final = data.replace(/data-v=".*?"/gms, '')
            .replace(/data-t=".*?"/gms, '')
            .replace(/xml:space=".*?"/gms, '')
            .replace(/id=".*?"/gms, '')
            .replace(/   /gms, ' ')
            .replace(/ >/gms, '>')
            .replace(/<tr><\/tr>/gms, '')
            .replace(/<td><\/td>/gms, '')

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
            console.log(final);
        };
    }

    render() {
        return (
            <>
                <input type="file" accept="xlsx, csv" onChange={this.handleChange} />
                <br />
                <br />
                <pre>
                    {this.state.htmlPreview}
                </pre>
                <br />
                <div ref={this.myRef}></div>
            </>
        )
    }
}
