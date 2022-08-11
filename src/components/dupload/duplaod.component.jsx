import React, { useState } from 'react'
import axios from 'axios';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';


import configData from "../../config.json";

const DUpload = ({ app, field, onUploaded }) => {
    const [state, setState] = useState(
        {
            name: '',
            path: '',
            preview: null,
            data: null
        }
    );

    //Select the file 
    const changePath = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        let src, preview, type = file.type;

        // match a string of type image/ at the beginning
        if (/^image\/\S+$/.test(type)) {
            src = URL.createObjectURL(file)
            preview = <img src={src} alt='' style={{ width: '275px', height: '275px' }} />
        }
        // match the string of type video/ at the beginning
        else if (/^video\/\S+$/.test(type)) {
            src = URL.createObjectURL(file)
            preview = <video src={src} autoPlay loop controls />
        }
        // match a string of type text/ at the beginning
        else if (/^text\/\S+$/.test(type)) {
            const reader = new FileReader();
            reader.readAsText(file);
            // Note: onload is an asynchronous function, which needs to be handled independently
            reader.onload = function (e) {
                preview = <textarea value={this.result}
                    /*   rows="4" cols="10"  */
                    style={{ width: '275px', height: '275px' }}
                    readOnly>

                </textarea>

                onUploaded(field, file.name)
                setState({
                    ...state,
                    path: file.name,
                    data: file,
                    preview: preview
                })
            }
            return;
        }
        // match a string of type /pdf at the ending
        else if (/pdf$/.test(type)) {
            src = URL.createObjectURL(file)
            preview = <iframe src={src} height="275" width="275"></iframe>
        }

        onUploaded(field, file.name)

        setState({
            ...state,
            path: file.name,
            data: file,
            preview: preview
        })
    }

    const uploadFile = async (e) => {
        const formData = new FormData();
        formData.append("formFile", state.data);
        formData.append("folderName", app.name);
        formData.append("fileName", state.path);

        try {
            const res = await axios.post(configData.SERVER_URL + "DUpload/UploadFile", formData);
            if (res.data.statusCod === 201) {
                onUploaded(field, res.data.savedPath)
                let file = document.getElementById('toUpload');
                let button = document.getElementById('uploadButton');
                file.hidden = true
                button.hidden = true
                setState({
                    name: '',
                    path: '',
                    preview: null,
                    data: null
                })
            }
        } catch (ex) {
            // console.log(ex);
        }
    };

    return (
        <div>
            <div className='row'>
                <div className='row-input'>
                    <input id='toUpload' type='file' accept='video/*,image/*,text/plain,.pdf' onChange={changePath} />
                    <input id='uploadButton' type='button' value='تحميل' style={{ display: 'inline-block' }} onClick={uploadFile} />
                </div>
            </div>
            <div>
                {state.preview}
            </div>
        </div>
    )
}

export default DUpload;