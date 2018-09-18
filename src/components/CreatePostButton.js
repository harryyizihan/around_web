import React from 'react';
import $ from 'jquery';
import { Modal, Button, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm';
import { API_ROOT, POS_KEY, TOKEN_KEY, AUTH_PREFIX, LOC_SHAKE } from '../constants';

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        this.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });
                console.log(values);
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                const token = localStorage.getItem(TOKEN_KEY);
                formData.set('lat', lat + LOC_SHAKE * Math.random() * 2 - LOC_SHAKE);
                formData.set('lon', lon + LOC_SHAKE * Math.random() * 2 - LOC_SHAKE);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);
                $.ajax({
                    url: `${API_ROOT}/post`,
                    method: 'POST',
                    data: formData,
                    headers: {
                        Authorization: `${AUTH_PREFIX} ${token}`,
                    },
                    processData: false,
                    contentType: false,
                    dataType: 'text',
                }).then(() => {
                    this.form.resetFields();
                    message.success('Successfully created a post.');
                    this.setState({ visible: false, confirmLoading: false });
                    this.props.loadNearbyPost();
                }, () => {
                    message.error('Failed to create a post.');
                    this.setState({ confirmLoading: false });
                }).catch((e) => {
                    console.log(e);
                });
            }
        });

    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    saveFromRef = (formInstance) => {
        this.form = formInstance;
    }

    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create Post Button</Button>
                <Modal title="Create New Post"
                       visible={visible}
                       onOk={this.handleOk}
                       okText="Create"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                >
                    <WrappedCreatePostForm ref={this.saveFromRef}/>
                </Modal>
            </div>
        );
    }
}
