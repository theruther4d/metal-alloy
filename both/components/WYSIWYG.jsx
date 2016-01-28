WYSIWYG = React.createClass({
    getInitialState() {
        return {
            html: this.props.content
        }
    },

    getButtonGroups() {
        if( !this.props.buttons ) {
            // put defaults here:
            return false;
        }

        return this.props.buttons.map( ( button, idx ) => {
            return (
                <div className="wysiwyg__toolbar__button-group" key={idx}>
                    { this.getButtonGroupButtons( button ) }
                </div>
            );
        });
    },

    getButtonGroupButtons( buttons ) {
        return buttons.map( ( button, idx ) => {
            return button.type == 'wrapTagWithClass' ? (
                <a
                    className="wysiwyg__toolbar__button-group__button"
                    onClick={this.execCommand.bind( this, button.type, {
                            tag: button.arg.tag,
                            class: button.arg.class
                        }
                    )}
                    key={idx}
                >
                    {button.label}
                </a>
            ) : (
                <a
                    className="wysiwyg__toolbar__button-group__button"
                    onClick={this.execCommand.bind( this, button.type, null ) }
                    key={idx}
                >
                    {button.label}
                </a>
            );
        });
    },

    handleFormatSelection( e ) {
        var children = e.target.children;

        var getSelectedChild = function( children ) {
            var selectedChild = false;

            Object.keys( children ).map( ( child ) => {
                if( e.target.value == children[child].value ) {
                    selectedChild = children[child];
                }
            });

            return selectedChild;
        }

        var selectedChild = getSelectedChild( children );

        this.execCommand( 'wrapTagWithClass', {
            tag: selectedChild.getAttribute( 'data-tag' ),
            class: selectedChild.getAttribute( 'data-class' )
        });
    },

    getFormats() {
        var formats = this.props.formats;

        if( !formats ) {
            return false;
        }

        var getOptions = function() {
            return formats.map( ( format, idx ) => {
                return (
                    <option key={idx} data-tag={format.tag} data-class={format.class}>{format.label}</option>
                );
            });
        };

        return (
            <select className="toolbar-formats" onChange={this.handleFormatSelection}>
                { getOptions() }
            </select>
        )
    },

    emitChange( e ) {
        var editor      = ReactDOM.findDOMNode( this.refs.editor ),
            newHTML     = editor.innerHTML;

        this.setState({
            html: newHTML
        }, () => {
            if( this.props.onChange ) {
                console.log( 'has onChange prop' );
                // this.props.onChange({
                //     target: {
                //         value: newHTML
                //     }
                // }.bind( this ));
            } else {
                console.log( 'no onChange provided' );
            }
        });
    },

    componentWillReceiveProps( newProps ) {
        this.setState({
            content: newProps.content
        });
    },

    shouldComponentUpdate( newProps ) {
        return newProps.content !== this.state.html
    },

    execCommand( command, arg ) {
        if( command == 'wrapTagWithClass' ) {
            document.execCommand( 'insertHTML', false, `<${arg.tag} class='${arg.class}'>${document.getSelection().toString()}</${arg.tag}` );
        } else {
            document.execCommand( command, false, arg );
        }


        this.emitChange();
    },

    render() {
        return (
            <div className="wysiwyg">
                <div className="wysiwyg__toolbar">
                    {this.getFormats()}
                    {this.getButtonGroups()}
                </div>
                <div
                    className="wysiwyg__editor"
                    ref="editor"
                    {...this.props}
                    contentEditable="true"
                    dangerouslySetInnerHTML={{__html: this.state.html}}
                />
            </div>
        );
    }
});
