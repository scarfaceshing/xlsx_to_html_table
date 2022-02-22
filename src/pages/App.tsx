import React, { Component, createRef } from 'react'
import * as XLSX from 'xlsx';
import './App.css'

import Papa from 'papaparse';

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
            htmlPreview: ''
        }
        this.myRef = React.createRef<any>();
    }

    handleChange = (event: any) => {
        const file = event.target.files[0]
        let vm = this;

        Papa.parse(file, {
            complete: function(results: any) {
                vm.displayTable(results);
            }
        });
    }

    displayTable = ({ data }: {data: any}) => {
        let table = ''
        const thead = data[0];
        const tbody = data.slice(1, data.length);

        table += `<table>`
        table += `\n\t<thead>`

        table += `\n\t\t<tr>`
        thead.forEach((item: any) => {
            table += `\n\t\t\t<th>${item}</th>`
        })
        table += `\n\t\t</tr>`
        table += `\n\t\</thead>`
        table += `\n\t\<tbody>`

        tbody.forEach((tr: any) => {
            table += `\n\t\t<tr>`
            tr.forEach((td: any) => {
                table += `\n\t\t\t<td>${td}</td>`
            })
            table += `\n\t\t</tr>`
        })

        table += `\n\t\</tbody>`

        this.setState({ htmlPreview: table })
    }

    render() {
        return (
            <>
                <input type="file" accept="xlsx, csv" onChange={this.handleChange} />
                <br />
                <br />
                {/* <pre ref={this.myRef}></pre> */}
                <pre>
                    {this.state.htmlPreview}
                </pre>
            </>
        )
    }
}
