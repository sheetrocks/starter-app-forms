import React, { Component, FormEvent } from 'react';
import axios from 'axios';

export type FormData = {
    id: string;
    submitterEmail: string;
    widgetCount: number;
    submissionDate: string;
}

interface FormState {
    formData: FormData;
}

interface FormProps {
    toast: (msg :string) => void;
    editingFormData: FormData | null;
    close :() => void;
}

class Form extends Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);

        let formData = props.editingFormData || {
            id: '',
            submitterEmail: '',
            widgetCount: 0,
            submissionDate: '',
        };

        this.state = {
            formData,
        };
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            let res;
            // if editing, use PUT, otherwise use POST
            if (this.props.editingFormData) {
                res = await axios.put(`/form`, {formData: this.state.formData});
            } else {
                res = await axios.post('/form', {formData: this.state.formData});
            }
            
            if (res.status === 200) {
                this.props.toast('Success!');
                this.props.close();
            } else {
                this.props.toast('Encountered an error.');
            }
        } catch (error) {
            console.error(error); // handle the error as needed
        }
    };

    render() {
        return (
            <>
            <h1>Widgets Produced</h1>
            <p>How many widgets did you produce today?</p>
            <form onSubmit={this.handleSubmit}>
                <label>
                    Widget Count:
                    <input 
                        type="number" 
                        name="widget_count" 
                        value={this.state.formData.widgetCount} 
                        onChange={(event) => this.setState({ 
                            formData: { 
                                ...this.state.formData, 
                                widgetCount: parseInt(event.target.value) 
                            } 
                        })} 
                    />
                </label>
                <br />
                <div className="form-buttons">
                <button className="cancel" onClick={this.props.close}>Cancel</button>
                <button className="submit" type="submit">Submit</button>
                </div>
            </form>
            </>
        );
    }
}

export default Form;
