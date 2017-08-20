class PostDataController < ApplicationController
  def create
    post_datum = PostDatum.new(post_datum_params)

    respond_to do |format|
      if post_datum.save
        format.json { render :json => { :status => 200, :message => 'Post data saved successfully', :post_datum => post_datum } }
      else
        format.json { render :json => { :status => :unprocessable_entity, :errors => post_datum.errors } }
      end
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def post_datum_params
      params.require(:post_datum).permit(:post_id, :data_type, :data)
    end
end
