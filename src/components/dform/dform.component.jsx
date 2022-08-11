import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import moment from "moment";

import DWindowLovModal from "../dwindow-lov-modal/dwindow-lov-modal.component";
import DReportTypeSelect2 from "../dreport-type-select2/dreport-type-select2.component";
import DChekgroup from "../dcheckgroup/dcheckgrop";
import { validateFields } from "../../dUtil/dFormUtil/validation";
import "bootstrap/dist/css/bootstrap.min.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "./dform.styles.css";

const DForm = ({
    select2Clear,
    divId,
    isRerended,
    handleClose,
    handleSave,
    array,
    settings,
    app,
    deepClone,
    params,
    isDisabled,
    deleteRow,
    rowDataArray,
    action,
    masterActionName,
    lovContainerId,
    unselectallrow,
    FILE_BROWSER_ROOT_DIRECTORY,
}) => {
    const [kind, setkind] = useState({ Value: "", name: "" });
    const [isDisable, setisDisable] = useState(true);
    const [allFieldsValidated, setAllFieldsValidated] = useState(false);
    const [stateObj, setStateObj] = useState(settings ? settings.params : []);
    const [reportType, setReportType] = useState(null);

    const tx = document.getElementsByTagName("CKEditor");

    let parente = "";
    let Value, val;
    let arrayy = Object.keys(stateObj);
    let curindex;
    let nextparam;
    let indexx;
    let enterarrang = [];

    useEffect(() => {
        if (settings && settings.id === "update") {
            setkind({ Value: Value, name: val });
        }
    }, []);

    let managegroup = (groups) => {
        let finalgroups = [];
        if (groups) {
            Object.keys(groups).map((group) => {
                if (!groups[group].hasOwnProperty("kind")) {
                    finalgroups.push(groups[group]);
                } else {
                    let kindgroups = groups[group];
                    val = kindgroups.groupitems[0].substr(2);
                    Value = settings.params[val].value;
                    let arName = kindgroups.arName;
                    let order = kindgroups.order;
                    let groupitems = kindgroups.groupitems;
                    finalgroups.push({
                        arName: arName,
                        order: order,
                        groupitems: groupitems,
                    });
                    Object.keys(kindgroups).map((kindgroup) => {
                        if (kindgroups[kindgroup].hasOwnProperty("key")) {
                            if (Value == kindgroups[kindgroup].key) {
                                finalgroups.push({
                                    key: kindgroups[kindgroup].key,
                                    arName: arName,
                                    order: order,
                                    groupitems:
                                        kindgroups[kindgroup].groupitems,
                                });
                            } else {
                                finalgroups.push({
                                    key: kindgroups[kindgroup].key,
                                    arName: arName,
                                    order: order,
                                    groupitems:
                                        kindgroups[kindgroup].groupitems,
                                });
                            }
                        }
                    });
                }
            });
        }
        return finalgroups;
    };

    let sort = (finalgroups) => {
        if (finalgroups) {
            const convert = Object.entries(finalgroups).map((e) => e[1]);
            const sorted = convert.sort((a, b) => b["order"] - a["order"]);
            return sorted;
        }
    };

    if (
        action &&
        action.hasOwnProperty("parents") &&
        action.parents.length > 0
    ) {
        action.parents.map((parent) => {
            if (masterActionName === parent.action) parente = parent.refCol;
        });
    }

    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute(
            "style",
            "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;",
        );
        tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    }

    const showAllFieldsValidated = () => {
        setTimeout(() => {
            let visibleArray = array ? array.filter((itm) => itm.visible) : [];
            let errors = visibleArray.map((p) => {
                if (p.name === parente) return (stateObj[p.name].error = false);
                else {
                    if (stateObj[p.name]) return stateObj[p.name].error;
                    else return false;
                }
            });
            if (errors.every((e) => e === false)) {
                setAllFieldsValidated(true);
            } else {
                setAllFieldsValidated(false);
            }
        }, 200);
    };

    showAllFieldsValidated();

    useEffect(() => {
        let visibleArray = array ? array.filter((itm) => itm.visible) : [];
        let tempParams = params ? JSON.parse(JSON.stringify(params)) : {};
        visibleArray.map((itm) => {
            let validationFunc;
            if (stateObj[itm.name]) {
                if (itm.type === "date") {
                    validationFunc = validateFields.validateDate;
                } else if (itm.type === "string") {
                    validationFunc = validateFields.validateString;
                } else if (itm.type === "int" || itm.type === "float") {
                    validationFunc = validateFields.validateInt;
                }

                if (tempParams[itm.name].hasOwnProperty("value")) {
                    let val =
                        tempParams[itm.name].value ||
                        tempParams[itm.name].value === 0
                            ? tempParams[itm.name].value.toString()
                            : null;
                    let isNull = tempParams[itm.name].hasOwnProperty("isNull")
                        ? tempParams[itm.name].isNull
                        : true;
                    tempParams[itm.name].error = validationFunc(val, isNull);
                }
            }
        });
        setStateObj(tempParams);
    }, []);

    /*
     * validates the field onBlur if sumbit button is not clicked
     * set the validateOnChange to true for that field
     * check for error
     */

    /*
     * update the value in state for that field
     * check for error if validateOnChange is true
     */
    const next = (index) => {
        return document.getElementsByName(arrayy[index]);
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode == 27) {
                handleClose(divId);
            }
            if (event.key == "Enter") {
                if (enterarrang.length > 0) {
                    var param = event.target.name;
                    let nextnode;
                    let nextindex = enterarrang.indexOf("P_" + param) + 1;
                    if (nextindex < enterarrang.length) {
                        nextparam = enterarrang[nextindex];
                        arrayy.map((paramsname, index) => {
                            if (nextparam === "P_" + paramsname) {
                                indexx = index;
                                nextnode = next(index);
                                if (nextnode.length > 0) nextnode[0].focus();
                            }
                        });
                    } else {
                        let Confirmbtn = document.getElementById("Confirm");
                        if (Confirmbtn.className === "Confirmclass") {
                            Confirmbtn.focus();
                        } else {
                        }
                    }
                } else {
                    var param = event.target.name;

                    arrayy.map((paramsname, index) => {
                        let nextparam;
                        if (param === paramsname) {
                            if (index + 1 < arrayy.length) {
                                curindex = index + 1;
                                if (next(curindex)[0]) {
                                    nextparam = next(curindex)[0].focus();
                                }
                            } else {
                                nextparam = document.getElementById("Confirm");
                                if (!nextparam.disabled) nextparam.focus();
                            }
                        }
                    });
                }
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [curindex]);

    const handleChange1 = (val, name) => {
        setStateObj({
            ...stateObj,
            [name]: {
                ...stateObj[name],
                value: val,
                error: false,
            },
        });
    };

    const handleChange = (validationFunc, evt) => {
        const field = evt.target.name;
        const fieldVal = evt.target.value;

        setStateObj({
            ...stateObj,
            [field]: {
                ...stateObj[field],
                value: fieldVal,
                error: stateObj[field]["validateOnChange"]
                    ? validationFunc(fieldVal, stateObj[field].isNull)
                    : "",
            },
        });
    };

    const handleChange3 = (editor) => {
        const field = "BODY";
        const val = editor.getData();
        const fieldVal = val.toString();
        setStateObj({
            ...stateObj,
            [field]: {
                ...stateObj[field],
                value: fieldVal,
            },
        });
    };
    const drowfields = (s, idx) => {
        return (
            <div className="fields_style" key={idx}>
                {s.fillFrom != null ? (
                    s.fillFrom.type === "grid" ? (
                        <div key={idx} className="divwindowrow">
                            <div
                                style={{
                                    textAlign: "right",
                                    padding: "2px",
                                    margin: "2px",
                                    width: "100%",
                                }}
                            >
                                {s.text}
                            </div>
                            <div className="frominput">
                                <input
                                    style={{
                                        boxShadow:
                                            "rgb(153, 153, 153) 0px 2px 5px",
                                        backgroundColor: " rgb(194, 214, 194)",
                                    }}
                                    cl="inputbutton"
                                    theme={"light"}
                                    rtl={"true"}
                                    width={150}
                                    height={23}
                                    type={"button"}
                                    value={
                                        stateObj[s.name]
                                            ? stateObj[s.name].displayText
                                                ? stateObj[s.name].displayText
                                                : ""
                                            : ""
                                    }
                                    onClick={() =>
                                        handleLovOpenBtn(stateObj[`${s.name}`])
                                    }
                                    className={classnames(
                                        "form-control",
                                        "inputbuttonclass",
                                        {
                                            "is-valid":
                                                stateObj[s.name].error ===
                                                false,
                                        },
                                        {
                                            "is-invalid":
                                                stateObj[s.name].error,
                                        },
                                    )}
                                    disabled={isDisabled}
                                />
                                <div className="invalid-feedback">
                                    {stateObj[s.name].error}
                                </div>
                            </div>
                        </div>
                    ) : s.fillFrom.type === "check" ? (
                        <div key={idx} className="divwindowrow">
                            <DChekgroup
                                s={handlechck(stateObj[s.name])}
                                IDs={stateObj[s.name].value}
                                handleChange11={handleChange1}
                            />
                        </div>
                    ) : s.type === "date" ? (
                        <div key={idx} className="divwindowrow">
                            <div
                                style={{
                                    textAlign: "right",
                                    padding: "2px",
                                    margin: "2px",
                                    width: "100%",
                                }}
                            >
                                {s.text}
                            </div>
                            <div className="frominput">
                                <input
                                    name={s.name}
                                    cl="inputbutton"
                                    theme={"light"}
                                    rtl={"true"}
                                    width={150}
                                    height={23}
                                    type={"date"}
                                    className={classnames(
                                        "form-control",
                                        {
                                            "is-valid":
                                                stateObj[s.name].error ===
                                                false,
                                        },
                                        {
                                            "is-invalid":
                                                stateObj[s.name].error,
                                        },
                                    )}
                                    onChange={(evt) =>
                                        handleChange(
                                            validateFields.validateDate,
                                            evt,
                                        )
                                    }
                                    value={
                                        stateObj[`${s.name}`]
                                            ? moment(
                                                  stateObj[`${s.name}`].value,
                                              ).format("YYYY-MM-DD") ===
                                              "Invalid date"
                                                ? null
                                                : moment(
                                                      stateObj[`${s.name}`]
                                                          .value,
                                                  ).format("YYYY-MM-DD")
                                            : ""
                                    }
                                    disabled={isDisabled}
                                />
                                <div className="invalid-feedback">
                                    {stateObj[s.name].error}
                                </div>
                            </div>
                        </div>
                    ) : s.hasOwnProperty("textSize") ? (
                        <div key={idx} className="divwindowrow">
                            <div
                                style={{
                                    textAlign: "right",
                                    padding: "2px",
                                    margin: "2px",
                                    width: "100%",
                                }}
                            >
                                {s.text}
                            </div>
                            <div className="frominput">
                                <CKEditor
                                    editor={ClassicEditor}
                                    style={{ height: "40px" }}
                                    name={s.name}
                                    rtl={"true"}
                                    width={165}
                                    height={40}
                                    className={classnames(
                                        "form-control",
                                        {
                                            "is-valid":
                                                stateObj[s.name].error ===
                                                false,
                                        },
                                        {
                                            "is-invalid":
                                                stateObj[s.name].error,
                                        },
                                    )}
                                    onChange={handleChange3}
                                    data={
                                        stateObj[s.name]
                                            ? stateObj[s.name].value
                                                ? stateObj[s.name].value
                                                : ""
                                            : ""
                                    }
                                    disabled={isDisabled}
                                />
                                {/*   <textarea
                                style={{ height: "40px" }}
                                name={s.name}
                                rtl={'true'}
                                width={165}
                                height={40}
                                className={classnames(
                                    'form-control',
                                    { 'is-valid': stateObj[s.name].error === false },
                                    { 'is-invalid': stateObj[s.name].error }
                                )}
                                onChange={evt => {
                                    s.type === "string" ?
                                        handleChange(validateFields.validateString, evt) :
                                        handleChange(validateFields.validateInt, evt)
                                }
                                }
                                value={stateObj[s.name] ?
                                    stateObj[s.name].value ?
                                        stateObj[s.name].value
                                        : ''
                                    : ''}
                                disabled={isDisabled}
                            /> */}
                                <div className="invalid-feedback">
                                    {stateObj[s.name].error}
                                </div>
                            </div>
                        </div>
                    ) : s.type === "select2" ? (
                        <DReportTypeSelect2
                            clear={select2Clear}
                            setReportType={setReportType}
                        />
                    ) : (
                        <div key={idx} className="divwindowrow">
                            <div
                                style={{
                                    textAlign: "right",
                                    padding: "2px",
                                    margin: "2px",
                                    width: "100%",
                                }}
                            >
                                {s.text}
                            </div>
                            <div className="frominput">
                                <input
                                    style={{
                                        borderLeft: "0",
                                        borderRight: "0",
                                        borderTop: "0",
                                        borderRadius: "0",
                                    }}
                                    placeholder={
                                        s.type === "string" ? " " : " "
                                    }
                                    name={s.name}
                                    rtl={"true"}
                                    width={165}
                                    height={30}
                                    className={classnames(
                                        "form-control",
                                        {
                                            "is-valid":
                                                stateObj[s.name].error ===
                                                false,
                                        },
                                        {
                                            "is-invalid":
                                                stateObj[s.name].error,
                                        },
                                    )}
                                    onChange={(evt) => {
                                        s.type === "string"
                                            ? handleChange(
                                                  validateFields.validateString,
                                                  evt,
                                              )
                                            : handleChange(
                                                  validateFields.validateInt,
                                                  evt,
                                              );
                                    }}
                                    value={
                                        stateObj[s.name]
                                            ? stateObj[s.name].value
                                                ? stateObj[s.name].value
                                                : ""
                                            : ""
                                    }
                                    disabled={isDisabled}
                                />
                                <div
                                    className="invalid-feedback"
                                    style={{ fontSize: "10px" }}
                                >
                                    {stateObj[s.name].error}
                                </div>
                            </div>
                        </div>
                    )
                ) : s.type === "date" ? (
                    <div key={idx} className="divwindowrow">
                        <div
                            style={{
                                textAlign: "right",
                                padding: "2px",
                                margin: "2px",
                                width: "100%",
                            }}
                        >
                            {s.text}
                        </div>
                        <div className="frominput">
                            <input
                                name={s.name}
                                cl="inputbutton"
                                theme={"light"}
                                rtl={"true"}
                                width={150}
                                height={23}
                                type={"date"}
                                className={classnames(
                                    "form-control",
                                    {
                                        "is-valid":
                                            stateObj[s.name].error === false,
                                    },
                                    { "is-invalid": stateObj[s.name].error },
                                )}
                                onChange={(evt) =>
                                    handleChange(
                                        validateFields.validateDate,
                                        evt,
                                    )
                                }
                                value={
                                    stateObj[`${s.name}`]
                                        ? moment(
                                              stateObj[`${s.name}`].value,
                                          ).format("YYYY-MM-DD") ===
                                          "Invalid date"
                                            ? null
                                            : moment(
                                                  stateObj[`${s.name}`].value,
                                              ).format("YYYY-MM-DD")
                                        : ""
                                }
                                disabled={isDisabled}
                            />
                            <div className="invalid-feedback">
                                {stateObj[s.name].error}
                            </div>
                        </div>
                    </div>
                ) : s.hasOwnProperty("textSize") ? (
                    <div key={idx} className="divwindowrow">
                        <div
                            style={{
                                textAlign: "right",
                                padding: "2px",
                                margin: "2px",
                                width: "100%",
                            }}
                        >
                            {s.text}
                        </div>
                        <div className="frominput">
                            <textarea
                                style={{ height: "40px" }}
                                name={s.name}
                                rtl={"true"}
                                width={165}
                                height={40}
                                className={classnames(
                                    "form-control",
                                    {
                                        "is-valid":
                                            stateObj[s.name].error === false,
                                    },
                                    { "is-invalid": stateObj[s.name].error },
                                )}
                                onChange={(evt) => {
                                    s.type === "string"
                                        ? handleChange(
                                              validateFields.validateString,
                                              evt,
                                          )
                                        : handleChange(
                                              validateFields.validateInt,
                                              evt,
                                          );
                                }}
                                value={
                                    stateObj[s.name]
                                        ? stateObj[s.name].value
                                            ? stateObj[s.name].value
                                            : ""
                                        : ""
                                }
                                disabled={isDisabled}
                            />
                            <div className="invalid-feedback">
                                {stateObj[s.name].error}
                            </div>
                        </div>
                    </div>
                ) : s.type === "select2" ? (
                    <DReportTypeSelect2
                        clear={select2Clear}
                        setReportType={setReportType}
                    />
                ) : (
                    <div key={idx} className="divwindowrow">
                        <div
                            style={{
                                textAlign: "right",
                                padding: "2px",
                                margin: "2px",
                                width: "100%",
                            }}
                        >
                            {s.text}
                        </div>
                        <div className="frominput">
                            <input
                                style={{
                                    borderLeft: "0",
                                    borderRight: "0",
                                    borderTop: "0",
                                    borderRadius: "0",
                                }}
                                placeholder={s.type === "string" ? " " : " "}
                                name={s.name}
                                rtl={"true"}
                                width={165}
                                height={30}
                                className={classnames(
                                    "form-control",
                                    {
                                        "is-valid":
                                            stateObj[s.name].error === false,
                                    },
                                    { "is-invalid": stateObj[s.name].error },
                                )}
                                onChange={(evt) => {
                                    s.type === "string"
                                        ? handleChange(
                                              validateFields.validateString,
                                              evt,
                                          )
                                        : handleChange(
                                              validateFields.validateInt,
                                              evt,
                                          );
                                }}
                                value={
                                    stateObj[s.name]
                                        ? stateObj[s.name].value
                                            ? stateObj[s.name].value
                                            : ""
                                        : ""
                                }
                                disabled={isDisabled}
                            />
                            <div
                                className="invalid-feedback"
                                style={{ fontSize: "10px" }}
                            >
                                {stateObj[s.name].error}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const drowform = (id) => {
        let checgroup = [];
        if (action && action.checkfeileds) checgroup = action.checkfeileds;
        if (settings.arrgroups && id != "delete") {
            const arrgroups = managegroup(settings.arrgroups);
            let newarrgroups = arrgroups;
            let extragroup = [];

            array.map((item) => {
                if (item.visible === true) {
                    let exist = false;
                    Object.keys(arrgroups).map((arrgroup) => {
                        arrgroups[arrgroup].groupitems.map((groupitem) => {
                            if (groupitem === item.name) {
                                exist = true;
                            }
                        });
                    });
                    if (exist === false) {
                        extragroup.push(item.name);
                    }
                }
            });

            if (extragroup.length > 0) {
                newarrgroups.extragroup = {
                    arName: "",
                    order: "5",
                    groupitems: extragroup,
                };
            }
            const groups = sort(newarrgroups).map((newarrgroup, idx) => {
                return (
                    <div
                        className="groupstyle"
                        key={idx}
                        style={{
                            display:
                                newarrgroup.hasOwnProperty("key") &&
                                newarrgroup.key != kind.Value
                                    ? "none"
                                    : "grid",
                        }}
                    >
                        <div className="group_name" key={idx}>
                            <label className="group_label" key={idx}></label>
                        </div>
                        {newarrgroup.groupitems.map(
                            (groupitem) =>
                                array &&
                                array
                                    .filter((itm) => itm.visible)
                                    .map((s, idx) =>
                                        s.name !== parente &&
                                        s.name === groupitem ? (
                                            <div className="form-group">
                                                {drowfields(s, idx)}
                                            </div>
                                        ) : null,
                                    ),
                        )}
                    </div>
                );
            });

            Object.keys(newarrgroups).map((newarrgroup) =>
                newarrgroups[newarrgroup].groupitems.map((groupitem) =>
                    enterarrang.push(groupitem),
                ),
            );

            return groups;
        } else if (id != "delete") {
            return (
                <>
                    <fieldset className="groupstyle">
                        {array &&
                            array
                                .filter((itm) => itm.visible)
                                .map((s, idx) =>
                                    s.name !== parente &&
                                    !checgroup.includes(s.dbName) ? (
                                        <div className="form-group" key={idx}>
                                            {drowfields(s, idx)}
                                        </div>
                                    ) : null,
                                )}
                    </fieldset>
                    <div className="checkStyle-class">
                        {array &&
                            array
                                .filter((itm) => itm.visible)
                                .map((s, idx) =>
                                    checgroup.includes(s.name) ? (
                                        <div className="checkStyle" key={idx}>
                                            {drowfields(s, idx)}
                                        </div>
                                    ) : null,
                                )}
                    </div>
                </>
            );
        } else return null;
    };

    /*
     * validate all fields
     * check if all fields are valid if yes then submit the Form
     * otherwise set errors for the feilds in the state
     */
    function isValueEquivalent(a, b) {
        if (a.value !== b.value) {
            return false;
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    function isEquivalent(a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (!isValueEquivalent(a[propName], b[propName])) return false;
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    const handleSaveBtn = async (param, ID) => {
        console.log(param);

        ID === "insert" &&
            action.name === "DWD_ORGANIZTION_FILEMNG_" &&
            action.parents &&
            action.parents.length &&
            (param[action.parents[0].refCol].value =
                FILE_BROWSER_ROOT_DIRECTORY);
        if (settings.id === "delete") {
            if (settings.delete === "mult") {
                Object.keys(settings.params).map((par) => {
                    handleSave(settings.params[par]);
                });
            } else {
                handleSave(param);
            }
        } else if (settings.id === "cancel_share") {
            handleSave(param, ID);
        } else if (settings.id === "finish") {
            handleSave(param);
        } else if (settings.id === "cancel_print") {
            handleSave(param);
        } else if (
            settings.id === "end_proc" ||
            settings.id === "cancel_complet"
        ) {
            handleSave(param);
        } else if (!isEquivalent(deepClone, param)) {
            if (reportType && reportType.value) {
                param.type = reportType.value;
            }
            handleSave(param, ID);
        } else handleClose(divId);
    };

    const handleLovSaveBtn = (obj) => {
        Value = kind.Value;
        setkind({ Value: obj.value, name: val });
        if (obj.name === val) {
            if (obj.value == Value) {
                Value = kind.Value;
                setkind({ Value: obj.value, name: val });
            }
        }
        setStateObj({
            ...stateObj,
            [obj.name]: {
                ...stateObj[obj.name],
                error: obj.value >= 0 ? false : "يرجى تحديد قيمة",
                value: obj.value,
            },
        });
        next(indexx);
    };

    const handlechck = (chckObj) => {
        let chckAction;
        for (let index = 0; index < app.groups.length; index++) {
            chckAction = app.groups[index].actions.find(
                (itm) => itm.name === chckObj.tbl,
            );
            if (chckAction) break;
        }

        let paramObject = {
            app: app,
            action: chckAction,
            chckAction: chckObj,
        };
        return paramObject;
    };

    const handleLovOpenBtn = (lovObj) => {
        let lovAction, lovGroupId;
        for (let index = 0; index < app.groups.length; index++) {
            lovAction = app.groups[index].actions.find(
                (itm) => itm.name === lovObj.tbl,
            );
            if (lovAction) {
                lovGroupId = app.groups[index].groupId;
                break;
            }
        }

        let paramObject = {
            app: app,
            action: lovAction,
            groupId: lovGroupId,
            lovAction: lovObj,
        };

        ReactDOM.render(
            <div>
                <DWindowLovModal
                    object={paramObject}
                    handleCancelBtn={handleClose}
                    handleLovSaveBtn={handleLovSaveBtn}
                    lovContainerId={lovContainerId}
                />
            </div>,
            document.getElementById(lovContainerId),
        );
    };

    const handleUploaded = (field, uploadPath) => {
        setStateObj({
            ...stateObj,
            [field]: {
                ...stateObj[field],
                value: uploadPath,
                error: stateObj[field]["validateOnChange"]
                    ? validateFields.validateString(uploadPath)
                    : "",
            },
        });
    };

    if (deepClone !== "erorr") {
        return (
            <div className="dform">
                <form className="form">
                    <div className="description">
                        {settings && settings.id === "insert" && (
                            <div>
                                هل تريد القيام بإضافة سجل جديد إلى جدول{" "}
                                {action.arName}{" "}
                            </div>
                        )}
                        {settings && settings.id === "update" && (
                            <div>
                                هل تريد القيام بالتعديل على معلومات هذا السجل من
                                جدول {action.arName}
                            </div>
                        )}
                    </div>
                    <div className="childrenform">
                        {settings && settings.id === "delete" && (
                            <div className="cells">
                                {rowDataArray ? (
                                    <label style={{ gridArea: "top" }}>
                                        هل تريد بالتأكيد حذف معلومات هذا السجل :
                                    </label>
                                ) : (
                                    ""
                                )}

                                {rowDataArray
                                    ? rowDataArray.map((itm, idx) => (
                                          <div className="celldelete" key={idx}>
                                              <label className="rownamedelete">
                                                  {itm.text}
                                              </label>

                                              <label className="rowvaluedelete">
                                                  {itm.type === "date"
                                                      ? moment(
                                                            deleteRow.bounddata[
                                                                itm.name
                                                            ],
                                                        ).format(
                                                            "MM/DD/YYYY",
                                                        ) === "Invalid date"
                                                          ? moment(
                                                                deleteRow
                                                                    .bounddata[
                                                                    itm.name
                                                                ],
                                                            ).format(
                                                                "MM/DD/YYYY",
                                                            ) == null
                                                          : moment(
                                                                deleteRow
                                                                    .bounddata[
                                                                    itm.name
                                                                ],
                                                            ).format(
                                                                "MM/DD/YYYY",
                                                            )
                                                      : deleteRow.bounddata[
                                                            itm.name
                                                        ]}
                                              </label>
                                          </div>
                                      ))
                                    : "هل تريد حذف القيم المحددة"}
                            </div>
                        )}
                        {settings && settings.id === "finish" && (
                            <div className="cells">
                                {rowDataArray ? (
                                    <label style={{ gridArea: "top" }}>
                                        هل تريد بالتأكيد إنهاء حل خلاف هذا السجل
                                        :
                                    </label>
                                ) : (
                                    ""
                                )}

                                {rowDataArray
                                    ? rowDataArray.map((itm, idx) => (
                                          <div className="celldelete" key={idx}>
                                              <label className="rownamedelete">
                                                  {itm.text}
                                              </label>

                                              <label className="rowvaluedelete">
                                                  {itm.type === "date"
                                                      ? moment(
                                                            deleteRow.bounddata[
                                                                itm.name
                                                            ],
                                                        ).format(
                                                            "MM/DD/YYYY",
                                                        ) === "Invalid date"
                                                          ? moment(
                                                                deleteRow
                                                                    .bounddata[
                                                                    itm.name
                                                                ],
                                                            ).format(
                                                                "MM/DD/YYYY",
                                                            ) == null
                                                          : moment(
                                                                deleteRow
                                                                    .bounddata[
                                                                    itm.name
                                                                ],
                                                            ).format(
                                                                "MM/DD/YYYY",
                                                            )
                                                      : deleteRow.bounddata[
                                                            itm.name
                                                        ]}
                                              </label>
                                          </div>
                                      ))
                                    : ""}
                            </div>
                        )}
                        {settings && settings.id === "end_proc" && (
                            <div className="cells">
                                {rowDataArray ? (
                                    <label style={{ gridArea: "top" }}>
                                        هل تريد بالتأكيد إنهاء عقد هذا السجل :
                                    </label>
                                ) : (
                                    ""
                                )}

                                {rowDataArray
                                    ? rowDataArray.map((itm, idx) => (
                                          <div className="celldelete" key={idx}>
                                              <label className="rownamedelete">
                                                  {itm.text}
                                              </label>

                                              <label className="rowvaluedelete">
                                                  {itm.type === "date"
                                                      ? moment(
                                                            deleteRow.bounddata[
                                                                itm.name
                                                            ],
                                                        ).format(
                                                            "MM/DD/YYYY",
                                                        ) === "Invalid date"
                                                          ? moment(
                                                                deleteRow
                                                                    .bounddata[
                                                                    itm.name
                                                                ],
                                                            ).format(
                                                                "MM/DD/YYYY",
                                                            ) == null
                                                          : moment(
                                                                deleteRow
                                                                    .bounddata[
                                                                    itm.name
                                                                ],
                                                            ).format(
                                                                "MM/DD/YYYY",
                                                            )
                                                      : deleteRow.bounddata[
                                                            itm.name
                                                        ]}
                                              </label>
                                          </div>
                                      ))
                                    : ""}
                            </div>
                        )}
                        {drowform(settings.id)}
                    </div>
                </form>
                <div className="footerdiv">
                    <input
                        className={
                            allFieldsValidated
                                ? "Confirmclass"
                                : "Confirmclassdis"
                        }
                        type={"button"}
                        value={"تأكيد"}
                        id={"Confirm"}
                        style={{ margin: "10px" }}
                        theme={"light"}
                        onClick={() => handleSaveBtn(stateObj, settings.id)}
                        width={"15%"}
                        height={20}
                        name={"Confirm"}
                        disabled={!allFieldsValidated && isDisable}
                        template={"success"}
                    />

                    <input
                        className="Cansleclass"
                        value={"إلغاء"}
                        type={"button"}
                        id={"Cancle"}
                        style={{ margin: "10px" }}
                        theme={"light"}
                        onClick={() => handleClose(divId)}
                        width={50}
                        height={20}
                        template={"danger"}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <>
                <div>
                    <label>لايمكن تعديل اكثر من قيمة في نفس الوقت</label>
                </div>
                <div className="footerdiv">
                    <input
                        className="Cansleclass"
                        value={"إلغاء"}
                        type={"button"}
                        id={"Cancle"}
                        style={{ margin: "10px" }}
                        theme={"light"}
                        onClick={() => handleClose(divId)}
                        width={50}
                        height={20}
                        template={"danger"}
                    />
                </div>
            </>
        );
    }
};

export default DForm;
