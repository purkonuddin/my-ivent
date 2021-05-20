import React, { Component } from "react";
import { connect } from "react-redux"; 
import './nastha.css';  
import { postEvent, fetchEvent } from '../../redux/actions/nastha'; 
import {
    Tabs,
    TabList,
    Tab,
    TabButton,
    TabPanel,
} from '../layout/Tabs';
import {nastha as ImageN} from '../../assets/properties'
import DatePicker from "react-datepicker";
import ReactPaginate from 'react-paginate';
import { validateFields } from './Validation';
import classnames from 'classnames';
import Loader from "../Loader";

const initialState = {
    title: {
      value: '',
      validateOnChange: false,
      error: ''
    },
    location: {
      value: '',
      validateOnChange: false,
      error: ''
    },
    submitCalled: false,
    allFieldsValidated: false,
    searchTerm: '',
    currentlyDisplayed: [],
    windowWidth: document.body.clientWidth, 
    partisipant:  {
        value: '',
        validateOnChange: false,
        error: ''
      },
    date: new Date(),
    description: {
        value: '',
        validateOnChange: false,
        error: ''
      },
    tagList: [],
    currPage: 1,
    postsPerPage: 5,
    posts:[],
    pageCount: 0,
    offset: 0,
    data: [],
    perPage: 2,
    currentPage: 0,
    loadingSearch: false,
    image_file:null,
    imageName: '',
    fetching: false
  };

class Nastha extends Component {
    static propTypes = {
        // url: PropTypes.string.isRequired,
        // author: PropTypes.string.isRequired,
        // perPage: PropTypes.number.isRequired,
      };
  constructor(props) {
    super(props);
    this.hiddenImageInput = React.createRef();
    this.mediaQuery = {
        desktop: 1200,
        tablet: 768,
        phone: 576,
      };

    this.state = initialState;
  }  

  onInputChange = (event) => {
      this.setState({loadingSearch: true})
    const newlyDisplayed = this.props.nastha.fetchEvent.data.results.filter(data => data.title.includes(event.target.value.toLowerCase()));
    this.setState({
      searchTerm: event.target.value,
      currentlyDisplayed: newlyDisplayed
    }); 

    }

  getEvents = async () => {  
    await this.props.dispatch(fetchEvent());
    if(this.props.nastha.fetchEvent.isFulfilled){
    this.setState({ 
        currentlyDisplayed: this.props.nastha.fetchEvent.data.results
      }); 
    }
  };  

  receivedData = async ()=> {
    // await this.getEvents()
    if(this.props.nastha.fetchEvent.isFulfilled){
        let data = this.props.nastha.fetchEvent.data.results
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        const postData = slice.map((pd, i) => <React.Fragment>
            <tr key={i}>
                <th  className="card-title text-capitalize" scope="row">{i+1}</th>
                <td  className="card-title text-capitalize">{pd.title}</td>
                <td  className="card-title text-capitalize">{pd.location}</td>
                <td  className="card-title text-capitalize">{pd.partisipan}</td>
                <td  className="card-title text-capitalize">{pd.date}</td>
                <td  className="card-title text-capitalize">{pd.description}</td>
            </tr>
        </React.Fragment>)

        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
        
            postData
        })
    }
  }

    componentDidMount = async () => { 
        await this.getEvents()
        await this.receivedData()
    }

  handleStateChange = (e) => {
        e.preventDefault(); 
        this.setState({
            [e.target.name]: e.target.value
        })
  }

  handleChangeDatePicker = (date, event) => {
    this.setState({date: date})
  };

  handlePageClick = (e) => {
    this.setState({loadingSearch: false})
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        this.receivedData()
    });

};

handleChangeImage = event => {
    const fileUploaded = event.target.files[0]; 

    this.setState({
        image_file: fileUploaded,
        imageName:URL.createObjectURL(fileUploaded)
    })
};

handleClickSelectImage = (event) => {
    this.hiddenImageInput.current.click();
}; 

handleFormSubmit = async() => { 
    this.setState({fetching: true})

    let { title, location, partisipant,description,date, image_file } = this.state; 

    let formData = new FormData();
    formData.append('title', title.value);
    formData.append('location', location.value);
    formData.append('partisipant', partisipant.value);
    formData.append('date', date);
    formData.append('description', description.value);
    formData.append('image', image_file); 
    console.log(partisipant);
    await this.props.dispatch(postEvent(formData));
    this.setState({fetching: false}, ()=> {
        this.getEvents()
        this.receivedData()
    })
}

/*
   * validates the field onBlur if sumbit button is not clicked
   * set the validateOnChange to true for that field
   * check for error
   */
handleBlur(validationFunc, evt) {
    const field = evt.target.name;
    // validate onBlur only when validateOnChange for that field is false
    // because if validateOnChange is already true there is no need to validate onBlur
    if (
      this.state[field]['validateOnChange'] === false &&
      this.state.submitCalled === false
    ) {
      this.setState(state => ({
        [field]: {
          ...state[field],
          validateOnChange: true,
          error: validationFunc(state[field].value)
        }
      }));
    }
    return;
  }

/*
   * update the value in state for that field
   * check for error if validateOnChange is true
   */
handleChange=(validationFunc, evt) => {
    const field = evt.target.name;
    const fieldVal = evt.target.value;
    this.setState(state => ({
      [field]: {
        ...state[field],
        value: fieldVal,
        error: state[field]['validateOnChange'] ? validationFunc(fieldVal) : ''
      }
    }));
  }

  /*
   * validate all fields
   * check if all fields are valid if yes then submit the Form
   * otherwise set errors for the feilds in the state
   */
  handleSubmit=(evt)=> {
    evt.preventDefault();
    // validate all fields
    const { title, location, partisipant,description } = this.state;
    const titleError = validateFields.validateTitle(title.value);
    const LokasiError = validateFields.validateLocation(location.value);
    const partisipantError = validateFields.validatePartisipant(partisipant.value);
    const descriptionError = validateFields.validateDescription(description.value);
    if ([titleError, LokasiError,partisipantError,descriptionError].every(e => e === false)) {
      // no errors submit the form
      console.log('success');

      // clear state and show all fields are validated
      this.setState({ ...initialState, allFieldsValidated: true });
      this.showAllFieldsValidated();
      this.handleFormSubmit()
      this.setState({
          description: {
            value: '',
            validateOnChange: false,
            error: ''
            }
        })
    } else {
      // update the state with errors
      this.setState(state => ({
        title: {
          ...state.title,
          validateOnChange: true,
          error: titleError
        },
        location: {
          ...state.location,
          validateOnChange: true,
          error: LokasiError
        },
        partisipant:{
            ...state.partisipant,
          validateOnChange: true,
          error: partisipantError
        },
        description:{
            ...state.description,
          validateOnChange: true,
          error: descriptionError
        }
      })); 
    }
  }

  showAllFieldsValidated=()=> {
    setTimeout(() => {
      this.setState({ allFieldsValidated: false });
    }, 1500);
  }


  render() {  
    const {currentlyDisplayed, title, location, partisipant,description, allFieldsValidated } = this.state;
    if(!this.props.nastha.fetchEvent.isFulfilled){
        return <Loader/>
    }
    return (
        <div key={0}>
            <Tabs selected={ 0 }>
                <div style={{position: "fixed"}} className="mt-2 ml-lg-5">
                    <a href={"/"} className="btn btn-lg text-uppercase font-weight-bold">Navbar Brand</a>
                </div>
                <TabList>
                
                <Tab>
                    <TabButton>Navbar Brand</TabButton>
                </Tab>
                <Tab>
                    <TabButton>+ Add Event</TabButton>
                </Tab>
                <Tab>
                    <TabButton>Dashboard</TabButton>
                </Tab>
                </TabList>
    
                <TabPanel>
                <div className="p-5 row">
                    {
                        this.props.nastha.fetchEvent.data.results.length >= 1 ? (
                            currentlyDisplayed.map((data, i)=> {
                                return (
                                    <div key={i} className="col mb-5"> 
                                        <div className="card" style={{width: "25rem"}}>
                                            <div className="bg-card">  
                                                <img className="card-img-top" src={data.image === '' ? ImageN : data.image} alt={"nastha"}/>
                                            </div>
                                            <div className="card-body border-bottom">
                                                <label className={"text-uppercase"}><i className="fa fa-map-marker" style={{color:"red"}}> </i> {data.location}</label>
                                                <h2 className="card-title text-capitalize font-weight-bold">{data.title}</h2>
                                                <p className="card-text">{data.date}</p>
                                            </div>
                                            <div className="card-body border-bottom participant">
                                                <a key={0} href={"asdf"} className="card-link"><i className="fa fa-user" style={{color:"blue"}}> </i> {data.partisipan}</a>
                                                <a key={1}href={"adasf"} className="card-link"><i className="fa fa-user" style={{color:"blue"}}> </i> Dimas P</a>
                                                <a key={2} href={"adasf"} className="card-link"><i className="fa fa-user" style={{color:"blue"}}> </i> Radistian</a>
                                            </div>
                                            <div className="card-body bg-light text-dark">
                                                <label className="font-weight-bold bg-transparent">Note:</label>
                                                <p className="card-text bg-transparent">{data.description}</p>
                                            </div>
                                        </div>
                                    </div> 
                                )
                            })
                        ):(
                            <div key={0} className="col"> 
                                <div className="card" style={{width: "18rem"}}>
                                    <div className="bg-secondary">  
                                        <img className="card-img-top" src={ImageN} alt={"nastha"}/>
                                    </div> 
                                    <div className="card-body participant">
                                        <Loader/> 
                                    </div>
                                    <div className="card-body">
                                        <label>Note:</label>
                                        <p className="card-text">Belum ada data</p>
                                    </div>
                                </div>
                            </div> 
                        )
                    }
                    
                </div>
                </TabPanel>
                <TabPanel> 
                    <div className="p-5 row">
                        
                        <div id="left" className="col p-5 bg-secondary">
                            <div className="row add-event-header ml-lg-5">
                                <h3 className="text-capitalize font-weight-bold mb-3">+ Add Event</h3>
                            </div>
                            {allFieldsValidated && (
                                <p className="text-success text-center">
                                    Success, All fields are validated
                                </p>
                                )}
                            <div className="row ">
                                <form onSubmit={evt => this.handleSubmit(evt)}>
                                    <div className="form-row">
                                        <div className="col">
                                            <input 
                                            type="text"  
                                            className={classnames(
                                                'form-control mb-2 text-capitalize',
                                                { 'is-valid': title.error === false },
                                                { 'is-invalid': title.error }
                                              )}
                                            name="title" 
                                            value={title.value} 
                                            placeholder="Title" 
                                            onChange={evt =>this.handleChange(validateFields.validateTitle, evt)}
                                            onBlur={evt => this.handleBlur(validateFields.validateTitle, evt)}/>
                                            <div className="bg-transparent invalid-feedback mb-4">{title.error}</div>
                                        </div>
                                        <div className="col">
                                            <input 
                                            type="text" 
                                            className={classnames(
                                                'form-control mb-2 text-capitalize',
                                                { 'is-valid': location.error === false },
                                                { 'is-invalid': location.error }
                                              )}
                                            name="location" 
                                            value={location.value} 
                                            placeholder="Location" 
                                            onChange={evt =>this.handleChange(validateFields.validateLocation, evt)}
                                            onBlur={evt => this.handleBlur(validateFields.validateLocation, evt)}/>
                                            <div className="bg-transparent invalid-feedback mb-4">{location.error}</div> 
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col">
                                            <input 
                                            type="text" 
                                            className={classnames(
                                                'form-control mb-2 text-capitalize',
                                                { 'is-valid': partisipant.error === false },
                                                { 'is-invalid': partisipant.error }
                                              )}
                                            name="partisipant" 
                                            value={partisipant.value} 
                                            placeholder="Partisipant" 
                                            onChange={evt =>this.handleChange(validateFields.validatePartisipant, evt)}
                                            onBlur={evt => this.handleBlur(validateFields.validatePartisipant, evt)}/>
                                            <div className="bg-transparent invalid-feedback mb-4">{partisipant.error}</div> 
                                        </div>
                                        <div className="col"> 
                                            <DatePicker
                                                selected={this.state.date}
                                                onChange={date => this.setState({date})}
                                                isClearable
                                                placeholderText="I have been cleared!"
                                                dateFormat="dd/MM/yyyy"
                                                />
                                        </div>
                                    </div>
                                    <div className="form-row"> 
                                        <div className="col">
                                        <textarea 
                                        className={classnames(
                                            'form-control mb-2',
                                            { 'is-valid': description.error === false },
                                            { 'is-invalid': description.error }
                                          )}
                                        id="exampleFormControlTextarea1" 
                                        name="description" 
                                        rows="5" 
                                        onChange={evt =>this.handleChange(validateFields.validateDescription, evt)}
                                        onBlur={evt => this.handleBlur(validateFields.validateDescription, evt)}> 
                                        </textarea>
                                        <div className="bg-transparent invalid-feedback mb-4">{description.error}</div> 
                                        </div>
                                    </div>
                                    <div className="form-row ">
                                    <button 
                                        type="button" 
                                        className="mt-3 btn btn-secondary ml-lg-1 btn-upload-file" 
                                        onClick={this.handleClickSelectImage}
                                        style={{
                                            backgroundColor: "#fff",
                                            borderColor: "currentColor",
                                        }}>Select image</button>
                                        <input 
                                            type="file" 
                                            encType="multipart/form-data" 
                                            name="image"   
                                            ref={this.hiddenImageInput}
                                            onChange={this.handleChangeImage}
                                            style={{
                                                visibility: "hidden",
                                                position: "absolute"
                                            }} 
                                        />
                                    </div>
                                    <div>
                                        <button 
                                        type="submit" 
                                        className="btn btn-dark float-right mt-3" 
                                        // onClick={this.handleFormSubmit}
                                        onMouseDown={() => this.setState({ submitCalled: true })}>Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col bg-nastha">
                            <div className="bg-nastha">
                                <img src={this.state.imageName === '' ? ImageN : this.state.imageName} alt={"nastha"} style={{
                                    maxWidth: this.state.windowWidth> this.mediaQuery.tablet ? "768px" : "576px"
                                }}/>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="p-5 col">
                        <div className="row">
                            <input className="form-control mr-sm-2 mb-5" type="search" placeholder="Search" aria-label="Search" onChange={(e)=>this.onInputChange(e)}/>
                        </div>
                        <div className="row">
                        <table className="table">
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Location</th>
                                <th scope="col">Date</th>
                                <th scope="col">Participane</th>
                                <th scope="col">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {!this.state.loadingSearch ? (
                                    this.state.postData

                                ):(
                                    currentlyDisplayed.length>0 ? (
                                        currentlyDisplayed.map((data, i)=> {
                                            return (
                                                <tr key={i}>
                                                    <th scope="row">{i+1}</th>
                                                    <td  className="card-title text-capitalize">{data.title}</td>
                                                    <td  className="card-title text-capitalize">{data.location}</td>
                                                    <td  className="card-title text-capitalize">{data.date}</td>
                                                    <td  className="card-title text-capitalize">{data.partisipan}</td>
                                                    <td  className="card-title text-capitalize">{data.description}</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <th scope="row">#</th>
                                            <td  colSpan={5}>No Field</td> 
                                        </tr>
                                    )
                                )
                                    
                                } 
                            </tbody>
                            </table>
                        </div>
                        <div className="row wrap-pagination"> 
                            {/* Using React Paginate */} 
                                <div>
                                    <ReactPaginate
                                    previousLabel={<i className="fa fa-chevron-circle-left" style={{color: '#47ccde'}} aria-hidden="true"></i>}
                                    nextLabel={<i className="fa fa-chevron-circle-right" style={{color: '#47ccde'}} aria-hidden="true"></i>}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    pageCount={this.state.pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={this.handlePageClick}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"}/>
                                </div>
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nastha: state.nastha
  };
};

export default connect(mapStateToProps)(Nastha);