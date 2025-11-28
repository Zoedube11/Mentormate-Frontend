import React from 'react';
import LogoImg from "../assets/logo.png";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center">
              <img src={LogoImg} alt="Logo" className="h-16" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start py-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-5xl w-full p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1d78a3] mb-6 text-center border-b-4 border-[#1d78a3] pb-4">
            Software Licence Terms and Conditions
          </h1>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-[#1d78a3] rounded-r-lg p-4 mb-6">
            <strong>Important:</strong> These Terms govern your use of the Mentormate software. By accessing or using the Software, you agree to be bound by these Terms and Conditions.
          </div>

          {/* Clause 1 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
            <span className="block font-semibold text-[#1d78a3] mb-2">1. Background</span>
            <p className="text-gray-800 leading-relaxed mb-2">
              <strong>1.1</strong> The Supplier is the entire legal and beneficial owner and licensor of the Software and is willing to license the Customer to use these products subject to the Terms.
            </p>
          </div>

          {/* Clause 2 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
            <span className="block font-semibold text-[#1d78a3] mb-3">2. Agreed Terms</span>
            
            <h3 className="text-lg font-semibold text-[#1d78a3] mt-4 mb-2">Interpretation</h3>
            <p className="text-gray-800 leading-relaxed mb-3">
              <strong>2.1</strong> The definitions and rules of interpretation in this clause apply in these Terms.
            </p>

            <div className="ml-6 space-y-3">
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.1</strong> <span className="font-semibold text-gray-900">"Affiliate"</span> means any business entity from time to time controlling, controlled by, or under common control with, either party;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.2</strong> <span className="font-semibold text-gray-900">"Business Day"</span> means any day other than a Saturday, Sunday or gazetted national public holiday in South Africa;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.3</strong> <span className="font-semibold text-gray-900">"Business Hours"</span> means the period from 9.00 am to 5.00pm on any Business Day;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.4</strong> <span className="font-semibold text-gray-900">"Data Protection Laws"</span> means any data protection or data privacy laws applicable in South Africa or to the parties and their conduct in terms of or relating to these Terms from time to time in respect of which compliance is mandatory;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.5</strong> <span className="font-semibold text-gray-900">"Fee"</span> means the licence fee payable by the Customer to the Supplier in respect of the Software as set out in clause 6;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.6</strong> <span className="font-semibold text-gray-900">"Intellectual Property Rights"</span> means all current and future intellectual property rights of whatsoever nature, whether registered or unregistered, arising anywhere in the world, including (without limitation) invention rights; patents; designs; trade marks; domain names; rights of copyright and all associated moral rights subsisting in or relating to Materials, (including in respect of any programming, algorithms, object code, source code and other Materials); database rights; know-how; trade secrets; confidential information; rights in goodwill and reputation; intellectual property rights in work product not protected by copyright laws; any similar rights eligible for protection anywhere in the world; and rights to sue any person for any present and/or past violation, infringement or misappropriation of any of the foregoing;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.7</strong> <span className="font-semibold text-gray-900">"Maintenance Release"</span> means a release of the Software that corrects faults, adds functionality or otherwise amends or upgrades the Software, but which does not constitute a New Version;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.8</strong> <span className="font-semibold text-gray-900">"Materials"</span> means all materials, software, systems, platforms, applications, interfaces (including APIs), modules, components, computer code, protocols, algorithms, technology, products, functional and technical specifications, documentation, research, reports, know-how, inventions, information, designs, studies, models, formulations, methodologies, protocols, techniques, processes, and/or works of authorship, in any form whatsoever, whether tangible or intangible, and whether confidential or not;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.9</strong> <span className="font-semibold text-gray-900">"New Version"</span> means any new version of the Software which from time to time is publicly marketed and offered for purchase by the Supplier in the course of its normal business, being a version which contains such significant differences from the previous versions as to be generally accepted in the marketplace as constituting a new product;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.10</strong> <span className="font-semibold text-gray-900">"Open-Source Software"</span> means any software programs which are licensed under any form of open-source licence meeting the Open Source Initiative's open source definition from time to time; and
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>2.1.11</strong> <span className="font-semibold text-gray-900">"Personal Data"</span> means personal data as defined in applicable Data Protection Laws.
              </p>
            </div>

            <p className="text-gray-800 leading-relaxed mt-4 mb-2">
              <strong>2.2</strong> Unless the context otherwise requires:
            </p>
            
            <div className="ml-6 space-y-2">
              <p className="text-gray-800 leading-relaxed">
                <strong>2.2.1</strong> words in the singular include the plural and in the plural include the singular;
              </p>
              <p className="text-gray-800 leading-relaxed">
                <strong>2.2.2</strong> a reference to a statute or statutory provision is a reference to it as amended, extended or re-enacted from time to time; and
              </p>
              <p className="text-gray-800 leading-relaxed">
                <strong>2.2.3</strong> any words following the terms including, include, in particular, for example or any similar expression shall be construed as illustrative and shall not limit the sense of the words, description, definition, phrase or term preceding those terms.
              </p>
            </div>

            <p className="text-gray-800 leading-relaxed mt-4">
              <strong>2.3</strong> A person includes a natural person, corporate or unincorporated body (whether or not having separate legal personality) and that person's personal representatives, successors and permitted assigns.
            </p>
            
            <p className="text-gray-800 leading-relaxed mt-3">
              <strong>2.4</strong> References to clauses are to the clauses of these Terms.
            </p>
            
            <p className="text-gray-800 leading-relaxed mt-3">
              <strong>2.5</strong> A reference to writing or written excludes fax but not email.
            </p>
          </div>

          {/* Clause 3 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
            <span className="block font-semibold text-blue-600 mb-2">3. Duration</span>
            <p className="text-gray-800 leading-relaxed">
              <strong>3.1</strong> These Terms shall commence on the date of signature by the party signing last in time and shall endure indefinitely until terminated in accordance with its terms.
            </p>
          </div>

          {/* Clause 4 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
            <span className="block font-semibold text-blue-600 mb-3">4. Licence</span>
            
            <p className="text-gray-800 leading-relaxed mb-3">
              <strong>4.1</strong> In consideration of the Fee paid by the Customer to the Supplier, the Supplier grants to the Customer a non-exclusive licence to use the Software for the month or year in respect of which the Fee has been paid.
            </p>
            
            <p className="text-gray-800 leading-relaxed mb-2">
              <strong>4.2</strong> In relation to scope of use:
            </p>
            
            <div className="ml-6 space-y-3">
              <p className="text-gray-800 leading-relaxed">
                <strong>4.2.1</strong> for the purposes of clause 4.1, use of the Software shall be restricted to use of the Software in object code form for the purpose of processing the Customer's data for the normal business purposes of the Customer (which shall not include allowing the use of the Software by, or for the benefit of, any person other than an employee of the Customer);
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>4.2.2</strong> the Customer may not use the Software other than as specified in these Terms (including clause 4.1 and clause 4.2.1) without the prior written consent of the Supplier, and the Customer acknowledges that additional fees may be payable on any change of use approved by the Supplier, including in accordance with clause 4.6.3;
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                <strong>4.2.3</strong> except as expressly stated in this clause, the Customer has no right (and shall not permit any third party) to copy, adapt, reverse engineer, decompile, disassemble, modify, adapt or make error corrections to the Software in whole or in part except to the extent that any reduction of the Software to human readable form (whether by reverse engineering, decompilation or disassembly) is necessary for the purposes of integrating the operation of the Software with the operation of other software or systems used by the Customer, unless the Supplier is prepared to carry out such action at a reasonable commercial fee or has provided the information necessary to achieve such integration within a reasonable period, and the Customer shall request the Supplier to carry out such action or to provide such information (and shall meet the Supplier's reasonable costs in providing that information) before undertaking any such reduction;
              </p>
            </div>

            <p className="text-gray-800 leading-relaxed mt-4 mb-2">
              <strong>4.3</strong> The Customer shall not:
            </p>
            
            <div className="ml-6 space-y-2">
              <p className="text-gray-800 leading-relaxed">
                <strong>4.3.1</strong> sub-license, assign or novate the benefit or burden of this licence in whole or in part;
              </p>
              <p className="text-gray-800 leading-relaxed">
                <strong>4.3.2</strong> allow the Software to become the subject of any charge, lien or encumbrance;
              </p>
              <p className="text-gray-800 leading-relaxed">
                <strong>4.3.3</strong> deal in any other manner with any or all of its rights and obligations under these Terms, and
              </p>
              <p className="text-gray-800 leading-relaxed">
                <strong>4.3.4</strong> allow the number of persons using the Software to exceed one;
              </p>
              <p className="text-gray-800 leading-relaxed">
                without the prior written consent of the Supplier.
              </p>
            </div>

            <p className="text-gray-800 leading-relaxed mt-4">
              <strong>4.4</strong> The Supplier may at any time sub-license, assign, novate, charge or deal in any other manner with any or all of its rights and obligations under this licence, provided it gives written notice to the Customer.
            </p>
            
            <p className="text-gray-800 leading-relaxed mt-3">
              <strong>4.5</strong> Each party confirms it is acting on its own behalf and not for the benefit of any other person.
            </p>
            
            <p className="text-gray-800 leading-relaxed mt-3 mb-2">
              <strong>4.6</strong> The Customer shall:
            </p>
            
            <div className="ml-6 space-y-2">
              <p className="text-gray-800 leading-relaxed">
                <strong>4.6.1</strong> keep a complete and accurate record of the Customer's copying and disclosure of the Software and its users, and produce such record to the Supplier on request from time to time;
              </p>
              <p className="text-gray-800 leading-relaxed">
                <strong>4.6.2</strong> notify the Supplier as soon as it becomes aware of any unauthorized use of the Software by any person;
              </p>
              <p className="text-gray-800 leading-relaxed">
                <strong>4.6.3</strong> pay, for broadening the scope of the licences granted under this licence to cover the unauthorized use, an amount equal to the fees which the Supplier would have levied (in accordance with its normal commercial terms then current) had it licensed any such unauthorised use on the date when such use commenced together with interest at the rate provided for in clause 6.3, from such date to the date of payment.
              </p>
            </div>

            <p className="text-gray-800 leading-relaxed mt-4">
              <strong>4.7</strong> The Customer shall permit the Supplier to inspect and have access to any premises (and to the computer equipment located there) at or on which the Software is being kept or used, and have access to any records kept in connection with this licence, for the purposes of ensuring that the Customer is complying with the terms of this licence, provided that the Supplier provides reasonable advance notice to the Customer of such inspections, which shall take place at reasonable times.
            </p>
          </div>
          
          {/* Clause 5 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
            <span className="block font-semibold text-blue-600 mb-2">5. Maintenance Releases</span>
            <p className="text-gray-800 leading-relaxed">
              The Supplier will provide the Customer with all Maintenance Releases generally made available to its customers. The Supplier warrants that no Maintenance Release will adversely affect the then existing facilities or functions of the Software. The Customer shall install all Maintenance Releases as soon as reasonably practicable after receipt.
            </p>
          </div>

          {/* Clause 6 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
            <span className="block font-semibold text-blue-600 mb-3">6. Fees</span>
            
            <p className="text-gray-800 leading-relaxed mb-3">
              <strong>6.1</strong> The Customer shall pay to the Supplier the licence fees in respect of the Software agreed in writing between the Supplier and Customer from time to time ("Fee Agreement"), monthly, in advance on or before the first day of the month in question.
            </p>
            
            <p className="text-gray-800 leading-relaxed mb-3">
              <strong>6.2</strong> The Customer shall make each payment due to the Supplier in full, free of any withholding, set-off, counter-claim, abatement or other similar deduction, into the bank account nominated in writing by the Supplier from time to time. The Customer must provide the Supplier with satisfactory proof that it has paid all applicable deductions and withholdings, including copies of the tax receipts evidencing such payments, within 30 days after the date of each payment.
            </p>
            
            <p className="text-gray-800 leading-relaxed">
              <strong>6.3</strong> If the Customer fails to make any payment due to the Supplier under these Terms by the due date for payment, then, without limiting the Supplier's remedies under clause 12, the Customer shall pay interest on the overdue amount at the rate of 2% per annum above First National Bank's base rate from time to time. Such interest shall accrue on a daily basis from the due date until actual payment of the overdue amount, whether before or after judgment. The Customer shall pay the interest together with the overdue amount.
            </p>
          </div>

          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
            <span className="block font-semibold text-blue-600 mb-2">23. Governing law and jurisdiction</span>
            <p className="text-gray-800 leading-relaxed mb-3">
              <strong>23.1</strong> These Terms are to be governed, interpreted and implemented in accordance with the laws of South Africa.
            </p>
            <p className="text-gray-800 leading-relaxed mb-3">
              <strong>23.2</strong> The parties consent to the non-exclusive jurisdiction of the Courts with Jurisdiction for any proceedings arising out of or in connection with these Terms.
            </p>
            <p className="text-gray-800 leading-relaxed italic text-gray-600">
              These Terms have been entered into by the parties on the date on which the Customer first accesses the Software.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center italic text-gray-600">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
}


  
  // useEffect(() => {
  //   const user = localStorage.getItem("user") || localStorage.getItem("token");
  //   if (user) {
  //     navigate("/mentormate-homepage");
  //   }
  // }, [navigate]);