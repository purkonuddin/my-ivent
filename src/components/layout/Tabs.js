import React from 'react'; 

class Tabs extends React.Component {
    state = { selected: this.props.selected };
  
    setSelected(selected) {
      if (selected !== this.state.selected) {
        this.setState({ selected })
      }
    }
  
    handleClick(tab) {
      return () => this.setSelected(tab)
    }
  
    renderTabList(child) {
      let tab = 0
  
      return React.cloneElement(child, {
        children: React.Children.map(child.props.children, (childTab) => {
          if (childTab.type.name === "Tab") {
            const _isActive = (tab === this.state.selected)
            const _onClick = this.handleClick(tab)
  
            tab++
  
            return React.cloneElement(childTab, { _isActive, _onClick })
          }
  
          return childTab
        }),
      })
    }
  
    renderChildren(children) {
      let panel = 0
  
      return React.Children.map(children, (child) => {
        if (child.type.name === "TabList") {
          return this.renderTabList(child)
        }
  
        if (child.type.name === "TabPanel") {
          const _isActive = (panel === this.state.selected)
  
          panel++
  
          return React.cloneElement(child, { _isActive })
        }
  
        return child
      })
    }
  
    render() {
      return (
        <div className="Tabs">
          { this.renderChildren(this.props.children) }
        </div>
      )
    }
  }

  const Tab = ({
    _onClick,
    _isActive,
    children,
  }) => (
    <li
      className={ `Tab  ${ _isActive ? "is-active" : "" }` }
      onClick={ _onClick }>
      { children }
    </li>
  )
  
  const TabList = ({ children }) => (
    <ul className="TabList pl-lg-5">
      { children }
    </ul>
  )

  const TabButton = ({ children }) => (
    <button className="Button">
      { children }
    </button>
  )
  
  const TabPanel = ({
    _isActive,
    children,
  }) => (
    <div className={ `TabPanel  ${ _isActive ? "is-active" : "" }` }>
      { children }
    </div>
  )

export {
    Tabs,
    TabList,
    Tab,
    TabButton,
    TabPanel,
}