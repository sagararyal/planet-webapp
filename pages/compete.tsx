import Layout from '../src/features/common/Layout';
// @ts-ignore
import { withTranslation } from '../i18n';

export default withTranslation('common')(function Compete() {
  return (
    <Layout>
      <p>Compete</p>
    </Layout>
  )
});
