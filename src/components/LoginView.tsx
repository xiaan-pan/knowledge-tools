import axios from "axios";
import React, { Component } from "react";
import "antd/dist/antd.css";
import { message } from 'antd';

import './css/LoginView.css'
import { PATH } from "../types/actionTypes";

interface LoginViewProps {
  history: any
}
interface LoginViewState {
  transform: string,
  name: string,
  email: string,
  password: string,
  verificationCode: string
  // verificationTime: string,
}
class LoginView extends Component<LoginViewProps, LoginViewState> {
  public verificationCode: number
  public constructor(props: LoginViewProps) {
    super(props);
    this.verificationCode = 5415454585415
    this.state = {
      transform: "",
      name: "",
      email: "",
      password: "",
      verificationCode: '',
      // verificationTime: '发送',
    }
  }

  public render(): JSX.Element {
    const { transform, name, email, password, verificationCode } = this.state;
    return (
      <div className='login-container'>
        <ul className="nav">
          <li onClick={this.changeTransform<React.MouseEvent<HTMLLIElement, MouseEvent>>('translateZ(-100px)')}>登录</li>
          <li onClick={this.changeTransform<React.MouseEvent<HTMLLIElement, MouseEvent>>('translateZ(-100px) rotateY( -90deg)')}>注册</li>
          <li onClick={this.changeTransform<React.MouseEvent<HTMLLIElement, MouseEvent>>('translateZ(-100px) rotateY( -180deg)')}>忘记密码</li>
          <li onClick={this.changeTransform<React.MouseEvent<HTMLLIElement, MouseEvent>>('translateZ(-100px) rotateX( -90deg)')}>订阅</li>
          <li onClick={this.changeTransform<React.MouseEvent<HTMLLIElement, MouseEvent>>('translateZ(-100px) rotateY( 90deg)')}>联系我们</li>
        </ul>
        <div className="wrapper">
          <div className="rec-prism" style={{
            transform
          }}>
            <div className="face face-top">
              <div className="content">
                <h2>订阅</h2>
                <small>
                  订阅更新，了解最新功能
                </small>
                <form onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="field-wrapper">
                    <input type="text" name="邮箱" placeholder="邮箱" />
                    <label>邮箱</label>
                  </div>
                  <div className="field-wrapper">
                    <input type="submit" onClick={() => {}} />
                  </div>
                </form>
              </div>
            </div>
            <div className="face face-front">
              <div className="content">
                <h2>登 录</h2>
                <form onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="field-wrapper">
                    <input type="text" name="username" placeholder="用户名"  value={email} onChange={this.handleChange<React.ChangeEvent<HTMLInputElement>>('email')} />
                    <label>邮箱</label>
                  </div>
                  <div className="field-wrapper">
                    <input
                      type="password"
                      name="password"
                      placeholder="密码"
                      autoComplete="new-password"
                      value={password}
                      onChange={this.handleChange<React.ChangeEvent<HTMLInputElement>>('password')}
                    />
                    <label>密码</label>
                  </div>
                  <div className="field-wrapper">
                    <input type="submit" onClick={this.login()} />
                  </div>
                  <span className="psw" onClick={this.changeTransform<React.MouseEvent<HTMLLIElement, MouseEvent>>('translateZ(-100px) rotateY( -180deg)')}>
                    忘记密码?
                  </span>
                  <span className="signup" onClick={this.changeTransform<React.MouseEvent<HTMLLIElement, MouseEvent>>('translateZ(-100px) rotateY( -90deg)')}>
                    没有账号？加入我们吧
                  </span>
                </form>
              </div>
            </div>
            <div className="face face-back">
              <div className="content">
                <h2>忘记密码?</h2>
                <small>
                  发送邮箱即可获得原密码
                </small>
                <form onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="field-wrapper">
                    <input type="text" name="email" placeholder="email" />
                    <label>邮箱</label>
                  </div>
                  <div className="field-wrapper">
                    <input type="submit" onClick={this.changeTransform<React.MouseEvent<HTMLInputElement, MouseEvent>>('translateZ(-100px) rotateX( 90deg)')} />
                  </div>
                </form>
              </div>
            </div>
            <div className="face face-right">
              <div className="content">
                <h2>注 册</h2>
                <form onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="field-wrapper">
                    <input type="text" name="name" placeholder="用户名" value={name} onChange={this.handleChange<React.ChangeEvent<HTMLInputElement>>('name')}/>
                    <label>用户名</label>
                  </div>
                  <div className="field-wrapper">
                    <input type="text" name="email" placeholder="邮箱" value={email} onChange={this.handleChange<React.ChangeEvent<HTMLInputElement>>('email')}/>
                    <label>邮箱</label>
                  </div>
                  <div className="field-wrapper">
                    <input
                      type="password"
                      name="password"
                      placeholder="密码"
                      autoComplete="new-password"
                      value={password}
                      onChange={this.handleChange<React.ChangeEvent<HTMLInputElement>>('password')}
                    />
                    <label>密码</label>
                  </div>
                  <div className="field-wrapper">
                    <input
                      type="text"
                      name="password2"
                      placeholder="password"
                      autoComplete="new-password"
                      value={verificationCode}
                      onChange={this.handleChange<React.ChangeEvent<HTMLInputElement>>('verificationCode')}
                    />
                    <label>验证码</label>
                    <span style={{
                      position: 'absolute',
                      right: 10,
                      top: 5,
                      userSelect: 'none',
                      cursor: 'pointer',
                      // border: '1px solid #07ad90'
                    }} id='verification-time' onClick={this.sendEmail()}>发送</span>
                  </div>
                  
                  <div className="field-wrapper" style={{ marginTop: 10 }}>
                    <input type="submit" onClick={this.register.bind(this)} />
                  </div>
                  
                </form>
              </div>
            </div>
            <div className="face face-left">
              <div className="content">
                <h2>联系我们</h2>
                <form onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="field-wrapper">
                    <input type="text" name="name" placeholder="name" />
                    <label>用户名</label>
                  </div>
                  <div className="field-wrapper">
                    <input type="text" name="email" placeholder="email" />
                    <label>邮箱</label>
                  </div>
                  <div className="field-wrapper">
                    <textarea placeholder="your message"></textarea>
                    <label>你的消息</label>
                  </div>
                  <div className="field-wrapper">
                     <input type="submit" onClick={this.changeTransform<React.MouseEvent<HTMLInputElement, MouseEvent>>('translateZ(-100px) rotateX( 90deg)')} />
                  </div>
                </form>
              </div>
            </div>
            <div className="face face-bottom">
              <div className="content">
                <div className="thank-you-msg">谢谢使用</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    // axios.post('http://127.0.0.1:8888/register?name=test&email=test&pwd=test').then((res: any) => {
    //   console.lohttp://g(res.data)
    // })
    // axios.get('login?email=1967914901&pwd=1234567', {withCredentials: true, headers:{'set-cookie': 'SameSite=None; Secure=true'}}).then((res: any) => {
    //   console.log(res.data)
    //   // axios.get('http://127.0.0.1:8888/index', {withCredentials: true, headers:{'set-cookie': 'SameSite=None; Secure=true'}}).then((res: any) => {
    //   //   console.log(res.data)
    //   // })
    // })
  }

  private changeTransform<T>(transform: string) {
    const Component = this;
    return function (event: T) {
      Component.setState({ transform })
    }
  }

  private handleChange<T extends React.ChangeEvent>(key: string) {
    const Component = this;
    return function (e: T) {
      // console.log(key, e)
      Component.setState({ [key as 'email']: (e.target as any).value })
    }
  }

  private login() {
    // console.log(this)
    const Component = this;
    const { email, password } = this.state;
    return function () {
      if (email.match(/^\w+@\w+\.\w+$/i)) {
        axios.get(`${PATH}/login?email=${email}&pwd=${password}`, {withCredentials: true}).then((res: any) => {
          if (res.data.status === 400 && res.data.message === '密码错误') {
            message.error('密码错误，请重新尝试', 1)
          } else if (res.data.status === 200 && res.data.message === '登录成功') {
            message.success('登录成功', 1)
            Component.setState({
              transform: 'translateZ(-100px) rotateX( 90deg)',
              email: '',
              password: '',
            }, () => {
              setTimeout(() => {
                Component.props.history.push('/index');
                
              }, 1000)
            })
          } else {
            message.error('该用户不存在', 1)
          }
        })
        
      } else {
        message.error('请输入正确的邮箱', 1);
      }
      
    }
    
  }

  private sendEmail() {
    const Component = this;
    const { email } = this.state;
    let timer: NodeJS.Timeout | boolean = false;
    const span:HTMLElement = document.getElementById('verification-time') as HTMLElement;
    return function () {
      if (span.innerHTML === '发送' && !timer) {
        // console.log('发送')
        if (email.match(/^\w+@\w+\.\w+$/i)) {
          axios.get(`/send_email?email=${email}`, {withCredentials: true}).then((res: any) => {
            if (res.data.status === 200 && res.data.message === '发送成功') {
              Component.verificationCode = res.data.data[0].verificationCode;
              message.success('验证码已发送', 1);
              span.innerHTML = '60';
              timer = setInterval(() => {
                if (parseInt(span.innerHTML) !== 0) {
                  span.innerHTML = (parseInt(span.innerHTML) - 1).toString();
                } else {
                  clearTimeout(timer as NodeJS.Timeout);
                  span.innerHTML = '发送';
                  timer = false;
                }
              }, 1000)
            } else {
              message.error('发送失败，请重新发送', 1);
            }
          })
        } else {
          message.error('请输入正确的邮箱', 1);
        }
      }
    }
  }

  private register() {
    const { name, email, password } = this.state;
    // console.log(this.verificationCode, this)
    if ('' + this.verificationCode === this.state.verificationCode) {
      axios.post(`/register?email=${email}&pwd=${password}&name=${name}`, {withCredentials: true}).then((res: any) => {
        if (res.data.status === 200 && res.data.message === '注册成功') {
          message.success('注册成，欢迎加入我们', 1);
          this.setState({ transform: 'translateZ(-100px) rotateX( 90deg)' })
        } else {
          message.error('该用户已存在', 1);
        }
      })
    } else {
      message.error('请输入正确的验证码', 1);
    }
  }
}
export default LoginView;
