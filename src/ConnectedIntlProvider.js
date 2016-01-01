// Connect react-intl Provide (IntlProvider) to the Redux Store
// for hot swapping of locales
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

const mapStateToProps = state => {
  return {
    // Locale is retrieved from the user's store
    // If no user logged in, default to EN (english)
    locale: state.user.data.locale,
    // Messages are retrieved from the i18l store
    messages: state.i18l.messages,
    // temp fix en case react doesnt re-render
    // key: state.user.data.locale
  };
};

export default connect(mapStateToProps)(IntlProvider);
